import * as chai from 'chai'
import { expect } from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as errorStack from './errorStack'

chai.use(sinonChai)

describe('errorStack', () => {
  let req: any
  let res: any
  let next: sinon.SinonStub

  beforeEach(() => {
    req = mockReq()
    res = mockRes()
    next = sinon.stub()
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should create an error stack on the request session and call the next middleware', () => {
    errorStack.errorStack(req, res, next)

    // Check for deep equality rather than strict;
    // it would fail strict equality because the returned object is not the same instance, though identical
    expect(req.session.errorStack).to.deep.equal([])
    // tslint:disable-next-line:no-unused-expression
    expect(next).to.be.called
  })

  it('should push an entry onto the error stack', () => {
    errorStack.errorStack(req, res, next)
    errorStack.push('First error')
    errorStack.push(['Err2', 'Second error'])

    expect(req.session.errorStack.length).to.equal(2)
    expect(req.session.errorStack[0]).to.equal('First error')
    expect(req.session.errorStack[1]).to.deep.equal(['Err2', 'Second error'])
  })

  it('should pop an entry from the error stack', () => {
    errorStack.errorStack(req, res, next)

    // Pre-load the error stack with some entries
    req.session.errorStack[0] = 'First error'
    req.session.errorStack[1] = ['Err2', 'Second error']

    let errorEntry = errorStack.pop()
    expect(errorEntry).to.deep.equal(['Err2', 'Second error'])
    expect(req.session.errorStack.length).to.equal(1)

    errorEntry = errorStack.pop()
    expect(errorEntry).to.equal('First error')
    expect(req.session.errorStack.length).to.equal(0)
  })

  it('should populate an object with entries from the error stack in reverse order, grouping all array entries at the bottom', () => {
    errorStack.errorStack(req, res, next)

    // Pre-load the error stack with some entries
    req.session.errorStack[0] = 'First error'
    req.session.errorStack[1] = ['Err2', 'Second error']
    req.session.errorStack[2] = ['Err3', 'Third error']
    req.session.errorStack[3] = 'Fourth error'
    req.session.errorStack[4] = 'Fifth error'
    req.session.errorStack[5] = ['Err6', 'Sixth error']

    const allErrors = errorStack.get()
    // tslint:disable:object-literal-sort-keys
    expect(allErrors).to.deep.equal({
      '0': 'Fifth error',
      '1': 'Fourth error',
      '2': 'First error',
      'Err6': 'Sixth error',
      'Err3': 'Third error',
      'Err2': 'Second error',
    })
    // tslint:enable:object-literal-sort-keys
  })
})
