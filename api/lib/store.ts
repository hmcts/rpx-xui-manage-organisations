export class Store {
    session

    constructor(req) {
        this.session = req.session
    }

    async set(key, value) {
        this.session[key] = value
    }

    async get(key) {
        return this.session[key]
    }

    // TODO: Add delete session that should be linked into the User Logging out.
}
