const express = require('express');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerPalavraChave = require('../controllers/controllerPalavrachave');
const controllerProjeto = require('../controllers/controllerProjeto');
const controllerConhecimento = require("../controllers/controllerConhecimento");
const controllerRelatorio = require("../controllers/controllerRelatorio");
const db = require('../config/db_sequelize');
const multer = require('multer');
const route = express.Router();


// db.sequelize.sync({force: true})
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));


// db.Usuario.create({login:'admin', senha:'1234', tipo:2});
// db.Usuario.create({login:'externo', senha:'1234', tipo:3});
// db.Conhecimento.create({nome:'Programação'});
// db.Conhecimento.create({nome:'Liderança'});
// db.Conhecimento.create({nome:'Corajoso'});

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

//Controller Palavra-Chave
route.get("/palavrachaveCreate", controllerPalavraChave.getCreate);
route.post("/palavrachaveCreate", controllerPalavraChave.postCreate);
route.get("/palavrachaveList", controllerPalavraChave.getList);
route.get("/palavrachaveUpdate/:id", controllerPalavraChave.getUpdate);
route.post("/palavrachaveUpdate", controllerPalavraChave.postUpdate);
route.get("/palavrachaveDelete/:id", controllerPalavraChave.getDelete);

//Controller Projeto
route.get('/projetoCreate', controllerProjeto.getCreate);
route.post('/projetoCreate', controllerProjeto.postCreate);
route.get('/projetoList', controllerProjeto.getList);
route.get('/projetoUpdate/:id', controllerProjeto.getUpdate);
route.post('/projetoUpdate', controllerProjeto.postUpdate);
route.post('/projetoUpdatePalavrasChave', controllerProjeto.postUpdatePalavrasChave);
route.post('/projetoDelete/:id', controllerProjeto.deleteProjeto);

// Rotas para visualizar projetos
route.get('/visualizarProjetos', controllerProjeto.getVisualizarProjetos);
route.get('/visualizarProjetosFiltrados', controllerProjeto.getVisualizarProjetosFiltrados);

//Controller Conhecimento Aluno
route.get("/conhecimentoCreate", controllerConhecimento.conhecimentosUsuario);
route.post("/conhecimentoAlunoUpdate", controllerConhecimento.updateUsuarioConhecimento);
route.get("/conhecimentoAluno/delete/:id", controllerConhecimento.deleteUsuarioConhecimento);

//Controller Conhecimento Admin
route.get("/conhecimentoCreateAdmin", controllerConhecimento.getCreate);
route.post("/conhecimentoCreateAdmin", controllerConhecimento.postCreate);
route.get("/conhecimentoList", controllerConhecimento.getList);
route.get("/conhecimentoUpdate/:id", controllerConhecimento.getUpdate);
route.post("/conhecimentoUpdate", controllerConhecimento.postUpdate);
route.post("/conhecimentoDelete/:id", controllerConhecimento.postDelete);

// Rota para o relatório
route.get('/relatorio', controllerRelatorio.getRelatorio);

// Rota para o relatório
route.get('/relatorio', controllerRelatorio.getRelatorio);
