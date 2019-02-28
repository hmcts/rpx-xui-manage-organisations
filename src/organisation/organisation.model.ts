export class Organisation {
    houseNoBuildingName: string
    addressLine1: string
    addressLine2: string
    name: string
    postcode: string
    townCity: string
    country: string
    constructor(prop) {
        Object.assign(this, prop)
    }
}
