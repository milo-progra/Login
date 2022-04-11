const flash = require('connect-flash/lib/flash');
const res = require('express/lib/response');
const passport = require('passport');
const { findById } = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//metodo para serializar los datos (guardar informacion en archivos internos de la pagina)
passport.serializeUser((user, done) => {
    done(null, user.id);
})

//metodo para deserializar los datos
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user);
})

//este proceso es solo para registrar un nuevo usuario
passport.use('local-signup', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},  async (req, email, password, done) => {


    const user = await User.findOne({email : email});
    if(user){
        console.log("estoy en el if")
        return done(null, false, req.flash('signUpMessage', 'El correo ya se encuentra registrado!!!'));

    } else {    
        console.log("estoy en el else")
        const newUser = new User(); 
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password)
        await newUser.save();
        return done(null, newUser); //guardamos las respuestas traves de done // done({errores}, {usuario})
    }
}));


passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true  
}, async(req, email, password, done )=>{
    const user = await User.findOne({email:email});
    if(!user){
        return done(null, false, req.flash('signinMessage', 'el usuario no se encuentra registrado!!!'))

    }
    if(!user.comparePassword(password)){
        return done(null, false, req.flash('signinMessage', 'constraseña incorrecta!!!'))
    }
    done(null, user);
}))








