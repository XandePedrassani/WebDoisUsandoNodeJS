const db = require('../config/db_sequelize');
const { QueryTypes } = require('sequelize');

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
        try {
            const palavraChaveId = req.params.id;

            // Remover referências na tabela projeto_palavra_chaves
            await db.sequelize.query('DELETE FROM projeto_palavra_chaves WHERE "palavraChaveId" = ?', { replacements: [palavraChaveId], type: QueryTypes.DELETE });

            // Deletar a palavra-chave
            await db.sequelize.query('DELETE FROM palavra_chaves WHERE id = ?', { replacements: [palavraChaveId], type: QueryTypes.DELETE });

            res.redirect('/palavrachaveList');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao deletar a palavra-chave.');
        }
    }
}