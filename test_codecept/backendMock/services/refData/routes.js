

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

router.get('/organisations', (req, res) => {
 
    res.send(service.getOrganization())
});


router.get('/organisations/users', (req, res) => {
    const params = req.query
    const respose = params.returnRoles ? service.getUsers(200) : service.getUsers(params.size)
    res.send(respose)
});


router.post('/organisations/users', (req, res) => {
   
    res.send({})
});


module.exports =  router;

