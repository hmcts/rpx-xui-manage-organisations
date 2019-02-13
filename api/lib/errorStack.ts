import * as express from 'express'

let  request = null

export function errorStack(req: express.Request , res: express.Response , next){
    request = req
    request.session.errorStack = []
    next()

}
// if the data is ana rray the first entry will be a key when returned by get()
export function push(data: any): void {
    request.session.errorStack.push(data)
}

export function pop(): any {
    return request.session.errorStack.pop()
}

export function get() {
    const outArray = {}
    let count = 0

    request.session.errorStack.reverse().map(error => {
        if (Array.isArray(error)) {
            outArray[error[0]] = error[1]
        } else {
            outArray[count] = error
            count++
        }
    })

    return outArray
}
