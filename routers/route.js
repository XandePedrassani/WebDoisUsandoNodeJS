const express = require('express');
const db = require('../config/db_sequelize');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerComentario = require('../controllers/controllerComentario');
const controllerPalavraChave = require('../controllers/controllerPalavrachave');
const controllerProjeto = require('../controllers/controllerProjeto')
const controllerReceita = require('../controllers/controllerReceita');
const controllerConhecimento = require("../controllers/controllerConhecimento");
const multer = require('multer');
const route = express.Router();

/*
db.sequelize.sync({force: true})
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
*/
/*
db.Usuario.create({login:'admin', senha:'1234', tipo:2});
db.Conhecimento.create({nome:'Programação'});
db.Conhecimento.create({nome:'Liderança'});
db.Conhecimento.create({nome:'Corajoso'});
*/
module.exports = route;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  "public/uploads/");
    },
    filename: (req, file, cb) => {
        req.imageName = req.body.nome + '.png'
        cb(null, req.imageName)
    },
})
const upload = multer({ storage: storage });

//Home
route.get("/home", function (req, res) {

    if (req.session.login) {
        res.render('home')
    }
    else
        res.redirect('/');
});

//Controller Usuario
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/logout", controllerUsuario.getLogout);
route.get("/usuarioCreate", controllerUsuario.getCreate);
route.post("/usuarioCreate", controllerUsuario.postCreate);
route.get("/usuarioList", controllerUsuario.getList);
route.get("/usuarioUpdate/:id", controllerUsuario.getUpdate);
route.post("/usuarioUpdate", controllerUsuario.postUpdate);
route.get("/usuarioDelete/:id", controllerUsuario.getDelete);

//Controller Categoria
//route.get("/categoriaCreate", controllerCategoria.getCreate);
//route.post("/categoriaCreate", controllerCategoria.postCreate);
//route.get("/categoriaList", controllerCategoria.getList);
//route.get("/categoriaUpdate/:id", controllerCategoria.getUpdate);
//route.post("/categoriaUpdate", controllerCategoria.postUpdate);
//route.get("/categoriaDelete/:id", controllerCategoria.getDelete);

//Controller Palavra-Chave
route.get("/palavrachaveCreate", controllerPalavraChave.getCreate);
route.post("/palavrachaveCreate", controllerPalavraChave.postCreate);
route.get("/palavrachaveList", controllerPalavraChave.getList);
route.get("/palavrachaveUpdate/:id", controllerPalavraChave.getUpdate);
route.post("/palavrachaveUpdate", controllerPalavraChave.postUpdate);
route.get("/palavrachaveDelete/:id", controllerPalavraChave.getDelete);

//Controller Projeto
route.get("/projetoCreate", controllerProjeto.getCreate);
route.post("/projetoCreate",  controllerProjeto.postCreate);
route.get("/projetoList", controllerProjeto.getList);
route.get("/projetoUpdate/:id", controllerProjeto.getUpdate);
//route.post("/projetoUpdate", upload.single('imagem'), controllerProjeto.postUpdate);
route.get("/projetoDelete/:id", controllerProjeto.getDelete);


//Controller Receita
route.get("/receitaCreate", controllerReceita.getCreate);
route.post("/receitaCreate",  upload.single('imagem'), controllerReceita.postCreate);
route.get("/receitaList", controllerReceita.getList);
route.get("/receitaUpdate/:id", controllerReceita.getUpdate);
route.post("/receitaUpdate", upload.single('imagem'), controllerReceita.postUpdate);
route.get("/receitaDelete/:id", controllerReceita.getDelete);

//Controller Conhecimento
route.get("/conhecimentoCreate", controllerConhecimento.conhecimentosUsuario);
route.post("/conhecimentoAlunoUpdate", controllerConhecimento.getUpdate);
route.get("/conhecimentoAluno/delete/:id", controllerConhecimento.getDelete);

