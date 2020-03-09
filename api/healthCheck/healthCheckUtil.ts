
export class HealthCheckUtil {

    public static addHealthCheckForTandCs(healthCheckEndpointDict: any) {

        if (!healthCheckEndpointDict['/fee-accounts'].includes('termsAndConditions')) {
            healthCheckEndpointDict['/fee-accounts'].push('termsAndConditions')
        }
        if (!healthCheckEndpointDict['/organisation'].includes('termsAndConditions')) {
            healthCheckEndpointDict['/organisation'].push('termsAndConditions')
        }
        if (!healthCheckEndpointDict['/users'].includes('termsAndConditions')) {
            healthCheckEndpointDict['/users'].push('termsAndConditions')
        }
    }

    public static manageTAndCFeature(isTandCEnabled: boolean, healthCheckEndpointDict: any) {
        if (isTandCEnabled) {
            HealthCheckUtil.addHealthCheckForTandCs(healthCheckEndpointDict)
        }
    }
}
