
const express = require('express');
const { requestMapping, configurations } = require('./reqResMapping');
const { browser } = require('protractor');
const port = 3001;

const nodeMockAvailablePort = require('./availablePortFinder');

class MockApp{
  init(){
    this.conf = {
      get: { ...requestMapping.get },
      post: { ...requestMapping.post },
      put: { ...requestMapping.put },
      delete: { ...requestMapping.delete }
    };
    this.configurations = Object.assign({}, configurations);
    console.log('Mock Config Initialized');
    return 'done';
  }

  async startServer(){
    const app = express();
    for (const [key, value] of Object.entries(this.conf.get)) {
      app.get(key, value);
    }

    for (const [key, value] of Object.entries(this.conf.post)) {
      app.post(key, value);
    }

    for (const [key, value] of Object.entries(this.conf.put)) {
      app.put(key, value);
    }

    for (const [key, value] of Object.entries(this.conf.delete)) {
      app.delete(key, value);
    }

    this.server = await app.listen(nodeMockAvailablePort);
    console.log('mock api started');
    // return "Mock started successfully"
  }

  async stopServer(){
    await this.server.close();
    this.conf = { };
    this.configurations = { };
  }

  onGet(path, callback){
    this.conf.get[path] = callback;
  }

  onPost(path, callback){
    this.conf.post[path] = callback;
  }

  onPut(path, callback){
    this.conf.put[path] = callback;
  }

  onDelete(path, callback){
    this.conf.delete[path] = callback;
  }

  setConfig(configKey, value){
    this.configurations[configKey] = value;
  }
}

const mockInstance = new MockApp();
//    mockInstance.onPost('/api/inviteUser', (req,res) => {
//             res.status(500).send({error:'server error occured'});
//         })

// mockInstance.setConfig("feature.termsAndConditionsEnabled",true);
// mockInstance.init();
// mockInstance.startServer();

module.exports = mockInstance;
