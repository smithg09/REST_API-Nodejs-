const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/users')

router.post('/', async (req, res) => {
    try {
        // console.log(req.body.name)
        const userexist = await  User.findOne({ 'email': req.body.email})

        if (req.body.password === userexist.password) {
            
            const token = jwt.sign({ _id: userexist._id }, 'asfagsagsf')
            res.header('auth-token', token).send(go(true, "Logged In", {
                "Token" : token
            }))
        }
        else {
            res.status("401").json(go(false , "Login Error" , {
                'Error' : 'Wrong password or email entered'
            }))
        }
        
    } catch {
        res.status("400").json(go(false , "Login Error" , {
            "msg" : "no user found"
        }))
    }
})

module.exports = router
