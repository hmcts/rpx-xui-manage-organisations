import { expect } from 'chai';
import pactNode from '@pact-foundation/pact-node';
import * as sinon from 'sinon';
import { publicationOptions, publishPacts } from '../publish/publish';

const source = { version: 'a'.repeat(40), branch: 'ticket-branch', dirty: false };
const settings = { broker: 'http://localhost:9292' };

describe('Pact publication', () => {
  afterEach(() => sinon.restore());
  it('publishes the full SHA with a separate first-class branch', async () => {
    const options = publicationOptions(settings, source);
    expect(options.consumerVersion).to.equal(source.version);
    expect(options.branch).to.equal(source.branch);
    expect(options.pactBroker).to.equal('http://localhost:9292');
    const publish = sinon.stub(pactNode, 'publishPacts').resolves([]);
    await publishPacts(settings, source);
    expect(publish.calledOnce).to.equal(true);
  });
  it('propagates publication rejection to its caller', async () => {
    sinon.stub(pactNode, 'publishPacts').rejects(new Error('Broker rejected publication'));
    let failure: Error;
    try {
      await publishPacts(settings, source);
    } catch (error) {
      failure = error;
    }
    expect(failure.message).to.equal('Broker rejected publication');
  });
  it('rejects dirty source before contacting the Broker', () => {
    expect(() => publicationOptions(settings, { ...source, dirty: true })).to.throw('Commit the Pact changes manually');
  });
  it('rejects short or mismatched versions and missing branches', () => {
    expect(() => publicationOptions({ ...settings, version: 'abcdef' }, source)).to.throw('full checked-out Git SHA');
    expect(() => publicationOptions({ ...settings, version: 'b'.repeat(40) }, source)).to.throw('full checked-out Git SHA');
    expect(() => publicationOptions(settings, { ...source, branch: '' })).to.throw('first-class Git branch');
  });
});
