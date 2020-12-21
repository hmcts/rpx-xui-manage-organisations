import * as assert from 'assert'
import { Store } from './store'

describe('store', () => {
    it('should create a Store instance with the session on the provided request object', async () => {
        const session = { 'key1': 'value1' }
        const testStore = new Store({ session })
        assert.equal(testStore.session, session)
    })

    it('should set a key-value pair in the Store', async () => {
        const session = { 'key1': 'value1' }
        const testStore = new Store({ session })
        // tslint:disable-next-line:no-empty
        Promise.resolve(testStore.set('key1', 'value2').then(_ => {}))
        Promise.resolve(testStore.get('key1').then(value => {
            assert.equal(value, 'value2')
        }))
    })

    it('should get a value from the Store, with the given key', async () => {
        const session = { 'key1': 'value1' }
        const testStore = new Store({ session })
        Promise.resolve(testStore.get('key1').then(value => {
            assert.equal(value, 'value1')
        }))
    })
})
