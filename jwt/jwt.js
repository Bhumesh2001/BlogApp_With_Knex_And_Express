const jwt = require('jsonwebtoken');
const knex = require('../database/db')

const generateToken = ((id)=>{
    return jwt.sign(id,'slskdfj987436uhkjsdkjsd98t5or')
})

const verifyToken = async(req,res,next)=>{
    if(req.headers.cookie){
        const Token = req.headers.cookie.split('=')[1]
        const UserId = jwt.verify(Token,'slskdfj987436uhkjsdkjsd98t5or')
        const UserData = await knex('blogUser').where({id:UserId})
        req.UserData = UserData
        next()
    }
    else{
        res.status(401).json({msg:'Login First'})
    }
}

module.exports = {generateToken,verifyToken}