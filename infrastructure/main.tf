locals {
  app_full_name     = "xui-${var.component}"
  ase_name          = "core-compute-${var.env}"
  local_env         = (var.env == "preview" || var.env == "spreview") ? (var.env == "preview") ? "aat" : "saat" : var.env
  shared_vault_name = "${var.shared_product_name}-${local.local_env}"

  managed_redis_environments = ["demo"]
  managed_redis_enabled_envs = contains(local.managed_redis_environments, var.env) ? toset([var.env]) : toset([])
}

data "azurerm_key_vault" "key_vault" {
  name                = local.shared_vault_name
  resource_group_name = local.shared_vault_name
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}

resource "azurerm_key_vault_secret" "redis6_connection_string" {
  name         = "${var.component}-redis6-connection-string"
  value        = "redis://${urlencode(module.redis6-cache.access_key)}@${module.redis6-cache.host_name}:${module.redis6-cache.redis_port}?tls=true"
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

module "redis6-cache" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=4.x"
  product                       = "${var.shared_product_name}-mo-redis6"
  name                          = "${var.product}-${var.component}-${var.env}"
  location                      = var.location
  env                           = var.env
  subnetid                      = data.azurerm_subnet.core_infra_redis_subnet.id
  common_tags                   = var.common_tags
  redis_version                 = "6"
  business_area                 = "cft"
  private_endpoint_enabled      = true
  public_network_access_enabled = false
  family                        = var.redis_family
  capacity                      = var.redis_capacity
  sku_name                      = var.redis_sku_name
}

module "managed_redis" {
  for_each = local.managed_redis_enabled_envs

  source = "git@github.com:hmcts/terraform-module-azure-managed-redis?ref=main"

  product     = var.product
  component   = var.component
  env         = var.env
  location    = var.location
  common_tags = var.common_tags

  sku_name = "Balanced_B1"

  public_network_access   = "Disabled"
  create_private_endpoint = true
  subnet_id               = data.azurerm_subnet.core_infra_redis_subnet.id
  private_dns_zone_ids    = [
    "/subscriptions/${var.private_dns_subscription_id}/resourceGroups/core-infra-intsvc-rg/providers/Microsoft.Network/privateDnsZones/privatelink.redis.azure.net"
  ]

  access_keys_authentication_enabled = true
  persistence_rdb_backup_frequency   = "6h"
}

resource "azurerm_key_vault_secret" "managed_redis_connection_string" {
  for_each = module.managed_redis

  name         = "${var.component}-managed-redis-connection-string"
  value        = "rediss://:${urlencode(each.value.primary_access_key)}@${each.value.hostname}:${each.value.port}?tls=true"
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

module "application_insights" {
  source = "git@github.com:hmcts/terraform-module-application-insights?ref=4.x"

  env                 = var.env
  product             = var.product
  name                = "${local.app_full_name}-appinsights"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  common_tags = var.common_tags
}

moved {
  from = azurerm_application_insights.appinsights
  to   = module.application_insights.azurerm_application_insights.this
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.app_full_name}-${var.env}"
  location = var.location

  tags = var.common_tags
}

resource "azurerm_key_vault_secret" "app_insights_connection_string" {
  name         = "appinsights-connection-string-mo"
  value        = module.application_insights.connection_string
  key_vault_id = data.azurerm_key_vault.key_vault.id
}
