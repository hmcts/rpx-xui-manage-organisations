#region Copying the test microservice key from s2s's vault to app's own vault
data "azurerm_key_vault" "s2s_vault" {
  name                = "s2s-${var.env}"
  resource_group_name = "rpe-service-auth-provider-${var.env}"
}

data "azurerm_key_vault_secret" "source_s2s-secret-for-tests" {
  name         = "microservicekey-xui-webapp"
  key_vault_id = "${data.azurerm_key_vault.s2s_vault.id}"
}

resource "azurerm_key_vault_secret" "xui-s2s-token" {
  name         = "xui-s2s-token"
  value        = "${data.azurerm_key_vault_secret.source_s2s-secret-for-tests.value}"
  key_vault_id = "${data.azurerm_key_vault.key_vault.id}"
}

#endregion
