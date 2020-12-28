const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const userdata = require('../models/users')
const blacklistedToken = require('..//models/blacklisted')
const { go } = require('../helpers/utils')


router.get('/', verifyauth ,  async (req, res) => {
    
    try {
        console.log(req.user)
        const user = await userdata.find({"_id" : req.user._id})
        if (user == '') {
            res.status("400").json(go(false , "User Error", {
                "Error": "No User available with id"
            }))
        }
            res.status("201").json(go(true,"Logged In User Details",user))
        
        } catch {
            res.status("400").json(go(false,"User Error" , {
                "Error" : "No user data available"
            }))
        }
})


router.post('/', async (req, res) => {
    const user = new userdata({
        id: req.body.id,
        email: req.body.name,
        password: req.body.password
    })
    // console.log(user);
    try {
        
        const newUser = await user.save()
        res.status(200).json(go(true,"User Created",newUser))
    } catch {
        res.status("400").json(go(false,"Registeration Error" , {
            "Error": "Error creating user"
        }))
    }
})


router.post('/logout', verifyauth, calcExpireDate , async (req, res) => {
    const bbtoken = new blacklistedToken({
        expiresAt: req.expiresDate,
        token: req.header('auth-token')
    })
    try {
        const newbbtoken = await bbtoken.save()
        res.status("200").json(go(true, "User loggedOut" , {
            "token": "Blacklisted"
        }))
    } catch {
        res.status("400").json(go(false, "Logout Error", {
            "Error": "Error Logging Out!"
        }))
    }
})


router.delete('/', verifyauth , async (req, res) => {
    const token = req.user;

    try {
        const user = await userdata.findOneAndDelete({ "_id": req.user._id });
        res.status("200").json(go(true,"User deleted",{
            token,
            user
        }))
    } catch {
        res.status("400").json(go(false, "User delete Error", {
            "Error" : "Error deleting user!!"
        }))
    }
    
    // res.redirect('/user')
})

function calcExpireDate(req, res ,next ) {
    Date.prototype.addDays = function (days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };
    var currentDate = new Date();
    var expireDate = currentDate.addDays(1);
    req.expiresDate  = expireDate
    next()
}


async function verifyauth(req, res, next) {
    const token = req.header('auth-token')
    if (!token) {
        return res.status("401").json(go(false,'Access Denied'))
    }
    
    try {
        var verifybb = await checkIfTokenValid(token)
        console.log("Checking if token blacklisted=> ", verifybb)
        if (!verifybb) {
            const verified = await jwt.verify(token, 'asfagsagsf')
            req.user = verified
            next()
        }
        else {
            res.status("401").json(go(false, {
                "msg": "Invalid Token"
            }))
        }
    } catch {
        res.status("401").json(go(false , {
            "msg": "Invalid Token"
        }))
    }

}

async function checkIfTokenValid(token) {
    const tokenexist = await blacklistedToken.findOne({ 'token': token })
    console.log(tokenexist)
    if (!tokenexist) {
        return false
    } else {
        return true
    }
}


module.exports = router
