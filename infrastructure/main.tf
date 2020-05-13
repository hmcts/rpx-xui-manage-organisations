locals {
    app_full_name = "xui-${var.component}"
    ase_name = "core-compute-${var.env}"
    local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
    shared_vault_name = "${var.shared_product_name}-${local.local_env}"
}

# module "app" {
#     source = "git@github.com:hmcts/cnp-module-webapp?ref=master"
#     product = "${local.app_full_name}"
#     location = "${var.location}"
#     env = "${var.env}"
#     ilbIp = "${var.ilbIp}"
#     subscription = "${var.subscription}"
#     capacity     = "${var.capacity}"
#     is_frontend = "${!(var.env == "preview" || var.env == "spreview") ? 1 : 0}"
#     additional_host_name = "${var.additional_host_name}"
#     https_only="true"
#     common_tags  = "${var.common_tags}"
#     asp_rg = "${local.app_full_name}-${var.env}"
#     asp_name = "${var.shared_product_name}-${var.env}"

#     app_settings = {
#         # logging vars & healthcheck
#         REFORM_SERVICE_NAME = "${local.app_full_name}"
#         REFORM_TEAM = "${var.team_name}"
#         REFORM_SERVICE_TYPE = "${var.app_language}"
#         REFORM_ENVIRONMENT = "${var.env}"

#         PACKAGES_NAME = "${local.app_full_name}"
#         PACKAGES_PROJECT = "${var.team_name}"
#         PACKAGES_ENVIRONMENT = "${var.env}"
#         PUI_ENV = "${var.env}"
#         NODE_ENV = "${var.env}"
#         NODE_CONFIG_ENV = "${var.env}"
#         NODE_CONFIG_DIR = "${var.node_config_dir}"
#         DUMMY_VAR = "TRUE"
#         WEBSITE_NODE_DEFAULT_VERSION  = "12.13.0"

#         S2S_SECRET = "${data.azurerm_key_vault_secret.s2s_secret.value}"
#         IDAM_SECRET = "${data.azurerm_key_vault_secret.oauth2_secret.value}"
#         GOOGLE_ANALYTICS_KEY = "${data.azurerm_key_vault_secret.google-analytics-key.value}"
#         LAUNCH_DARKLY_CLIENT_ID = "${data.azurerm_key_vault_secret.launch-darkly-client-id.value}"

#         # API CONFIG
#         SESSION_SECRET = "${var.session_secret}"
#         NODE_TLS_REJECT_UNAUTHORIZED = "${var.node_tls_reject_unauthorized}"
#         NOW = "${var.api_now}"
#         IDAM_CLIENT = "${var.idam_client}"
#         OAUTH_CALLBACK_URL = "${var.oauth_callback_url}"
#         MAX_LOG_LINE = "${var.max_log_line}"
#         EXCEPTION_OPTIONS_MAX_LINES = "${var.exception_options_max_lines}"
#         INDEX_URL = "${var.index_url}"
#         LOGGING = "${var.logging}"
#         PROTOCOL = "${var.protocol}"
#         ALLOW_CONFIG_MUTATIONS = "${var.allow_config_mutations}"
#         APP_INSIGHTS_ENABLED = "${var.app_insights_enabled}"

#         # FEATURE TOGGLES
#         FEATURE_APP_INSIGHTS_ENABLED = "${var.feature_app_insights_enabled}"
#         FEATURE_SECURE_COOKIE_ENABLED = "${var.feature_secure_cookie_enabled}"
#         FEATURE_PROXY_ENABLED = "${var.feature_proxy_enabled}"
#         FEATURE_TERMS_AND_CONDITIONS_ENABLED = "${var.feature_terms_and_conditions_enabled}"
#         FEATURE_HELMET_ENABLED = "${var.feature_helmet_enabled}"
#         FEATURE_REDIS_ENABLED = "${var.feature_redis_enabled}"

#         // Redis Cloud
#         REDISCLOUD_URL = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
#         REDIS_KEY_PREFIX = "activity:"

#         # COOKIE SETTINGS
#         COOKIE_TOKEN = "${var.cookie_token}"
#         COOKIE_USER_ID = "${var.cookie_user_id}"
#         MICROSERVICE = "${var.microservice}"

#         # SERVICE URLS
#         CCD_DATA_API_SERVICE = "${var.ccd_data_api_service}"
#         CCD_DEFINITION_API_SERVICE = "${var.ccd_definition_api_service}"
#         IDAM_API_SERVICE = "${var.idam_api_service}"
#         IDAM_WEB_SERVICE = "${var.idam_web_service}"
#         RD_PROFESSIONAL_API_SERVICE = "${var.rd_professional_api_service}"
#         S2S_SERVICE = "${var.s2s_service}"
#         FEE_AND_PAY_API = "${var.fee_and_pay_api}"

#         TERRAFORM_TEST = "${var.terraform_test}"

#         # PROXY (If required)
#         AO_HTTP_PROXY = "${var.mo_http_proxy}"
#         AO_NO_PROXY = "${var.mo_no_proxy}"
      
#         MANAGE_CASE_LINK = "${var.manage_case_link}"
#         MANAGE_ORG_LINK = "${var.manage_org_link}"
#     }
# }


data "azurerm_key_vault" "key_vault" {
    name = "${local.shared_vault_name}"
    resource_group_name = "${local.shared_vault_name}"
}

data "azurerm_key_vault_secret" "s2s_secret" {
    name = "mo-s2s-client-secret"
    vault_uri = "${data.azurerm_key_vault.key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "oauth2_secret" {
    name = "xui-oauth2-token"
    vault_uri = "${data.azurerm_key_vault.key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "google-analytics-key" {
  name = "google-analytics-key"
  vault_uri = "${data.azurerm_key_vault.key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "launch-darkly-client-id" {
  name = "launch-darkly-client-id"
  vault_uri = "${data.azurerm_key_vault.key_vault.vault_uri}"
}


provider "azurerm" {
    version = "1.22.1"
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}

resource "azurerm_key_vault_secret" "redis_connection_string" {
  name = "${var.component}-redis-connection-string"
  value = "redis://ignore:${urlencode(module.redis-cache.access_key)}@${module.redis-cache.host_name}:${module.redis-cache.redis_port}?tls=true"
  key_vault_id = "${data.azurerm_key_vault.key_vault.id}"
}

module "redis-cache" {
  source      = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product     = "${var.shared_product_name}-mo-redis"
  location    = "${var.location}"
  env         = "${var.env}"
  subnetid    = "${data.azurerm_subnet.core_infra_redis_subnet.id}"
  common_tags = "${var.common_tags}"
}
