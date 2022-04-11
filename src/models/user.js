const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const userSchema = Schema(
  {
    email: String,
    password: String
  }
);

userSchema.methods.encryptPassword = (password) =>{ //metodo para encriptar el password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(password, this.password)
};

module.exports = mongoose.model('User', userSchema);
