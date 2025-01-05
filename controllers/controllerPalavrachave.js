const db = require('../config/db_sequelize');

module.exports = {
    async getCreate(req, res) {
        res.render('palavrachave/palavrachaveCreate');
    },
    async postCreate(req, res) {
        db.PalavraChave.create(req.body).then(() => {
            res.redirect('/home');
        }).catch((err) => {
            console.log(err);
        });
    },
    async getList(req, res) {
        db.PalavraChave.findAll().then(palavrachaves => {
            res.render('palavrachave/palavrachaveList', { palavrachaves: palavrachaves.map(catg => catg.toJSON()) });
        }).catch((err) => {
            console.log(err);
        });
    },
    async getUpdate(req, res) {
        await db.PalavraChave.findByPk(req.params.id).then(
            palavrachave => res.render('palavrachave/palavrachaveUpdate', {palavrachave: palavrachave.dataValues })
        ).catch(function (err) {
            console.log(err);
        });
    },
    async postUpdate(req, res) {
        await db.PalavraChave.update(req.body, { where: { id: req.body.id } }).then(
            res.render('home')
        ).catch(function (err) {
            console.log(err);
        });
    },
    async getDelete(req, res) {
        await db.PalavraChave.destroy({ where: { id: req.params.id } }).then(
            res.render('home')
        ).catch(err => {
            console.log(err);
        });
    }
}   