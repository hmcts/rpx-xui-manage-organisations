

const express = require('express');
let {conf,configurations} = require('./reqResMapping');
const port = 3001;


class MockApp{

    async startServer(){
        const app = express();
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

    onGet(path, callback){
        conf.get[path] = callback; 
    }


    onPost(path, callback){
        conf.post[path] = callback; 
    }

    onPut(path, callback){
        conf.put[path] = callback; 
    }

    onDelete(path, callback){
        conf.delete[path] = callback; 
    }

    setConfig(configKey,value){
       configurations[configKey] = value; 
    }

}

const mockInstance = new MockApp();
//    mockInstance.onPost('/api/inviteUser', (req,res) => {
//             res.status(500).send({error:'server error occured'});
//         })

// mockInstance.setConfig("feature.termsAndConditionsEnabled",true);
// mockInstance.startServer();

module.exports = mockInstance;
