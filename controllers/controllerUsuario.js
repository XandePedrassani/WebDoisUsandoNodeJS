const db = require('../config/db_sequelize');
const { QueryTypes } = require('sequelize');

module.exports = {
    async getLogin(req, res) {
        res.render('usuario/login', { layout: 'noMenu.handlebars' });
    },
    async getLogout(req, res) {
        req.session.destroy();
        res.redirect('/');
    },
    async postLogin(req, res) {
        var user = {
            login: req.body.login
        }
        db.Usuario.findAll({ where: { login: req.body.login, senha: req.body.senha } }
        ).then(usuarios => {
            if (usuarios.length > 0) {
                req.session.login = req.body.login;
                res.locals.login = req.body.login; 
                req.session.userId = usuarios[0].dataValues.id;
                if (usuarios[0].dataValues.tipo == 2) {
                    req.session.tipo = usuarios[0].dataValues.tipo;
                    req.session.admin = true;
                    res.locals.admin = true;
                } else if (usuarios[0].dataValues.tipo == 1){
                    req.session.tipo = usuarios[0].dataValues.tipo;
                    req.session.aluno = true;
                    res.locals.aluno = true;
                } else if (usuarios[0].dataValues.tipo == 3){
                    req.session.tipo = usuarios[0].dataValues.tipo;
                    req.session.externo = true;
                    res.locals.externo = true;
                }
                res.render('home');
            } else
                res.redirect('/');
        }).catch((err) => {
            console.log(err);
        });
    },
    async getCreate(req, res) {
        res.render('usuario/usuarioCreate');
    },
    async postCreate(req, res) {
        db.Usuario.create(req.body).then(() => {
            res.redirect('/home');
        }).catch((err) => {
            console.log(err);
        });
    },
    async getList(req, res) {
        db.Usuario.findAll().then(usuarios => {
            res.render('usuario/usuarioList', { usuarios: usuarios.map(user => user.toJSON()) });
        }).catch((err) => {
            console.log(err);
        });
    },
    async getUpdate(req, res) {
        await db.Usuario.findByPk(req.params.id).then(
            usuario => res.render('usuario/usuarioUpdate', { usuario: usuario.dataValues })
        ).catch(function (err) {
            console.log(err);
        });
    },
    async postUpdate(req, res) {
        await db.Usuario.update(req.body, { where: { id: req.body.id } }).then(
            res.render('home')
        ).catch(function (err) {
            console.log(err);
        });
    },
    async getDelete(req, res) {
        try {
            const usuarioId = req.params.id;

            // Remover referências na tabela projeto_alunos
            await db.sequelize.query('DELETE FROM projeto_alunos WHERE "usuarioId" = ?', { replacements: [usuarioId], type: QueryTypes.DELETE });

            // Deletar o usuário
            await db.sequelize.query('DELETE FROM usuarios WHERE id = ?', { replacements: [usuarioId], type: QueryTypes.DELETE });

            res.redirect('/usuarioList');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao deletar o usuário.');
        }
    }
}