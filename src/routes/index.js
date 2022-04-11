const express = require('express');
const { redirect } = require('express/lib/response');
const res = require('express/lib/response');
const router = express.Router();
const passport = require('passport');
const Notas = require('../models/notas');




router.get('/', (req, res, next) => {
    res.render('index')
})
router.get('/signup', (req, res, next) => {
    res.render('signup')
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/listaNotas',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/signin', (req, res, next) => {
    res.render('signin')
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/listaNotas',
    failureRedirect: '/signin',
    passReqToCallback: true //para resivir internamente los datos del reques
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

router.get('/listaNotas', isAuthenticated, (req, res, next) => {

    Notas.find({ user: req.user.id }).exec((err, notas) => {
        if (err) return res.status(500).send({ message: 'error al mostrar las notas' })

        res.render('notas/lista', { notas })
    });
})

// router.get('/listaNotas', (req, res) => {
//     Notas.find({}).exec((err, notas) => {
//         if (err) return res.status(500).send({ message: 'error al mostrar las notas' })

//         res.render('notas/lista', { notas })
//     });
// });


//funcion que genera una respuesta cuando el usuario esta autentificado o no
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/signin')
    }
}



// Rutas de notas 
router.get('/agregarNotas', isAuthenticated, (req, res) => {
    res.render('notas/agregar.ejs')
})
router.post('/savenotas', (req, res) => {
    var notas = new Notas();
    var params = req.body;
    notas.title = params.title;
    notas.description = params.description;
    notas.user = req.user.id
    notas.save((err, nota) => {
        if (err) return res.status(500).send({ message: 'error al ingresar una nota' })
        return res.redirect('/listaNotas');
    })
})



router.get('/eliminarNota/:id', async (req, res) => {
    var notasId = req.params.id
    var nota = await Notas.findById(req.params.id)
    console.log("el usuario es:" + nota.user);

    if(nota.user != req.user.id){
        console.log("no se puede eliminar!!!!!");
        return res.redirect('/agregarNotas')
        
    }else{

        Notas.findByIdAndDelete(notasId, (err, notaDelete) => {
            if (err) return res.render(500).send({ message: 'error al eliminar la nota' })
            return res.redirect('/listaNotas')
        });
    }

});

router.get('/actualizarNota/:id', async (req, res) => {
    const nota = await Notas.findById(req.params.id)
    console.log("el usuario es: " + nota.user);
    console.log(nota);
    if (nota.user != req.user.id) {
        return res.redirect('listaNotas')
    }
    res.render('notas/update', { nota })
})

router.post('/saveUpdate', (req, res) => {
    const notaId = req.body.id
    console.log("la id es:" + notaId); //para poder mostrar la id debo ponerla en el form de editar con el tributo readonly
    Notas.findByIdAndUpdate(notaId,
        {
            title: req.body.title,
            description: req.body.description
        }, (err, nota) => {
            if (err) return console.log(err, notaId);
            return res.redirect('listaNotas')

        });
})




module.exports = router;