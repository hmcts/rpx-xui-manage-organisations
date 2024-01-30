

const express = require('express')

const router = express.Router({ mergeParams: true });
const service = require('./index')

router.get('/', (req, res) => {
    const caseIds = req.query.case_ids
    res.send({ case_assignments :[]})
});



router.post('/', (req, res) => {
    res.send({})
});




module.exports =  router;

