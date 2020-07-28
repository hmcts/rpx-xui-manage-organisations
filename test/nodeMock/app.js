

const express = require('express');
const {conf,featureToggles} = require('./reqResMapping');
const app = express();
const port = 3001;


class MockApp{


    setfeatureToggle(){

    }

    async startServer(){
        console.log(JSON.stringify(conf));
        for (const [key, value] of Object.entries(conf.get)) {
            app.get(key, value);
        }

        for (const [key, value] of Object.entries(conf.post)) {
            app.post(key, value);
        }

        for (const [key, value] of Object.entries(conf.put)) {
            app.put(key, value);
        }

        for (const [key, value] of Object.entries(conf.delete)) {
            app.delete(key, value);
        }

        this.server = await app.listen(port)
        console.log("mock api started");
        return "Mock started successfully"

    }

    async stopServer(){
        await this.server.close();
    }

}

const mockInstance = new MockApp();
// mockInstance.startServer();

module.exports = mockInstance;
