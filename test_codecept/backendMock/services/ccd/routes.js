

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

router.post('/searchCases', (req, res) => {
    res.send(service.getCaseTypes())
});


router.post('/internal/searchCases', (req, res) => {
    res.send(service.getCases())
});


router.get('/organisations/users', (req, res) => {
    const params = req.query
    const respose = params.returnRoles ? service.getUsers(200) : service.getUsers(params.size)
    res.send(respose)
});



module.exports =  router;

