const express = require('express')
const { loginUserHandler, logoutUserHandler } = require('../handlers/AuthHandler')

router = express.Router()

router.post('/login', loginUserHandler)
router.post('/logout', logoutUserHandler)

module.exports = router