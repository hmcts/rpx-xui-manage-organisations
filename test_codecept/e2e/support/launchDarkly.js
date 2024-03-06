//import * as LDClient from 'launchdarkly-js-client-sdk';
//import { config } from '../config/common.conf';

const LDClient = require('@launchdarkly/node-server-sdk');
const config = require('../config/common.conf');
//config.config.launchDarklyClientId
const client = LDClient.init('***REMOVED***');

let ogdFeature; 

//await client.waitUntilReady();
//export const ogdToggle = client.variation('ogd-invite-user-flow', false);

const context = {
  'kind': 'user',
  'key': 'user-key-123abc',
  'name': 'Sandy'
};

client.once('ready', () => {
  client.variation('ogd-invite-user-flow', context, false,
    (err, feature) => {
      ogdFeature = feature;
    });
});

module.exports = { ogdFeature };
