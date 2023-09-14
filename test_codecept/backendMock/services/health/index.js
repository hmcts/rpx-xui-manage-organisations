
const { v4 } = require('uuid');

class Health{

    constructor(){
       
    }

    getHealthResponse(){
        return healthResponse;
    }

}


module.exports = new Health();


const healthResponse = {
    "status": "UP",
    "components": {
        "db": {
            "status": "UP",
            "details": {
                "database": "PostgreSQL",
                "validationQuery": "isValid()"
            }
        },
        "discoveryComposite": {
            "description": "Discovery Client not initialized",
            "status": "UNKNOWN",
            "components": {
                "discoveryClient": {
                    "description": "Discovery Client not initialized",
                    "status": "UNKNOWN"
                }
            }
        },
        "diskSpace": {
            "status": "UP",
            "details": {
                "total": 133003395072,
                "free": 93247086592,
                "threshold": 10485760,
                "exists": true
            }
        },
        "livenessState": {
            "status": "UP"
        },
        "ping": {
            "status": "UP"
        },
        "readinessState": {
            "status": "UP"
        },
        "refreshScope": {
            "status": "UP"
        },
        "serviceAuth": {
            "status": "UP"
        }
    },
    "groups": [
        "liveness",
        "readiness"
    ]
}

