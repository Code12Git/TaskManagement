const { userModel } = require('../models');
const { AppError } = require('../utils');
const { CONFLICT } = require('../utils/errors');
const bcrypt = require('bcryptjs')

const register = async (body) => {
    const {name,email,username,password} = body;
    try{
        const user = userModel.findOne({email})
        if(user) throw new AppError({...CONFLICT,message:"User Already Exists"})
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await userModel.create({
            name,
            email,
            password:hashedPassword,
            username
        })
        return newUser;
    }catch(err){
        throw err;
    }
}


const login = async(body) => {
    const {email,password} = body;
    
}


module.exports = {register}
