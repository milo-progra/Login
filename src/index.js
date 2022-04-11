const express = require('express');
const engine = require('ejs-mate')
const path = require('path')
const morgan = require('morgan');
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const jsdom = require('jsdom')

//inicializaciones
const app = express();
require('./database')
require('./passport/local-auth')
var JSDOM = jsdom.JSDOM;

//static file
app.use(express.static(path.join(__dirname, 'public')));

//setting
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);  

//midelwares  (estos son methodos que se ejecutan entre la peticion del usuario y su llegada al servidor)
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize()); //iniciar passport
app.use(passport.session()); //guardar datos del usuario en los archivos de la pagina

app.use((req, res, next) => {
  app.locals.signUpMessage = req.flash('signUpMessage') //forma para usar una variable en todo el programa
  app.locals.signinMessage = req.flash('signinMessage')
  app.locals.errorMessage = req.flash('errorMessage')
  next(); //next sirve para relizar la funcion de arriba y luego continuar y asi el sistema no se queda congelado
});


//Routes
app.use('/', require('./routes/index'));


//starting the server
app.listen(app.get('port'),() =>{
    console.log("server on Port ", app.get('port'));
});