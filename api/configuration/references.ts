/**
 * References to the configuration properties and their values contained with
 * the /config .yaml files.
 *
 * We store reference on how to extract the value from the .yaml data structure here.
 *
 * They are reference strings and therefore need to be testable.
 *
 * This file should be representative of the .yaml files in /config, and not
 * contain any additional constants. They are grouped as a representation of the .yaml structure.
 */
export const APP_INSIGHTS_KEY = 'secrets.rpx.appinsights-instrumentationkey-mo'
export const S2S_SECRET = 'secrets.rpx.mo-s2s-client-secret'
export const IDAM_SECRET = 'secrets.rpx.xui-oauth2-token'
export const GOOGLE_ANALYTICS_KEY = 'secrets.rpx.google-analytics-key'
export const LAUNCH_DARKLY_CLIENT_ID = 'secrets.rpx.launch-darkly-client-id'

export const ENVIRONMENT = 'environment'

export const STUB = 'stub'
export const COOKIE_TOKEN = 'cookies.token'
export const COOKIES_USERID = 'cookies.userId'

export const MAX_LINES = 'exceptionOptions.maxLines'

export const INDEX_URL = 'indexUrl'
export const MAX_LOG_LINE = 'maxLogLine'
export const IDAM_CLIENT = 'idamClient'
export const MICROSERVICE = 'microservice'
export const NOW = 'now'
export const OAUTH_CALLBACK_URL = 'oauthCallbackUrl'
export const PROTOCOL = 'protocol'

export const SERVICES_IDAM_API_PATH = 'services.idamApi'
export const SERVICES_IDAM_WEB = 'services.idamWeb'
export const SERVICE_S2S_PATH = 'services.s2s'
export const SERVICES_RD_PROFESSIONAL_API_PATH = 'services.rdProfessionalApi'
export const SERVICES_FEE_AND_PAY_API_PATH = 'services.feeAndPayApi'
export const SERVICES_TERMS_AND_CONDITIONS_API_PATH = 'services.termsAndConditions'
export const SERVICES_CCD_CASE_ASSIGNMENT_API_PATH = 'services.caseAssignmentApi'

export const SERVICES_CCD_DATA_STORE_API_PATH = 'services.ccdDataApi'
export const SERVICES_MCA_PROXY_API_PATH = 'services.caseAssignmentApi'

export const SESSION_SECRET = 'sessionSecret'

export const LOGGING = 'logging'
export const JURISDICTIONS = 'jurisdictions'

export const HELMET = 'helmet'

export const FEATURE_SECURE_COOKIE_ENABLED = 'secureCookieEnabled'
export const FEATURE_APP_INSIGHTS_ENABLED = 'appInsightsEnabled'
export const FEATURE_PROXY_ENABLED = 'proxyEnabled'
export const FEATURE_TERMS_AND_CONDITIONS_ENABLED = 'termsAndConditionsEnabled'
export const FEATURE_HELMET_ENABLED = 'helmetEnabled'
export const FEATURE_REDIS_ENABLED = 'redisEnabled'

export const LINKS_MANAGE_CASES_LINK = 'links.manageCaseLink'
export const LINKS_MANAGE_ORG_LINK = 'links.manageOrgLink'

// REDIS CONFIG
export const REDISCLOUD_URL = 'secrets.rpx.mo-webapp-redis-connection-string'
export const REDIS_TTL = 'redis.ttl'
export const REDIS_KEY_PREFIX = 'redis.prefix'

export const SESSION_TIMEOUTS = 'sessionTimeouts'
