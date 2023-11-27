const router = require('express').Router()
const { ActivateAccount } = require('../controllers/activation.controller')

router.get('/:id', ActivateAccount)

module.exports = router