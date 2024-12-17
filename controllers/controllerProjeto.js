const db = require('../config/db_sequelize');
const path = require('path');

module.exports = {
    async getCreate(req, res) {
        var palavraChave = await db.PalavraChave.findAll()
        res.render('projeto/projetoCreate', {
            palavraChave: palavraChave.map(palavraChave => palavraChave.toJSON())
        });
    },
    async postCreate(req, res) {
        const {nome, resumo, link_externo, palavraChave} = req.body;
        try{
            const novoProjeto = await db.Projeto.create({nome, resumo, link_externo})
            const novoProjetoId = novoProjeto.dataValues.id

            palavraChave.forEach(async(element) => {
                await db.ProjetoPalavraChave.create({projetoId: novoProjetoId, palavraChaveId: element})
            });

            res.redirect('/home')
        } catch(err){
            console.log(err);
        }
    },
/*    async getList(req, res) {
        db.Receita.findAll().then(receitas => {
            res.render('receita/receitaList',
                { receitas: receitas.map(receita => receita.toJSON()) });
        }).catch((err) => {
            console.log(err);
        });
    },
    async getUpdate(req, res) {
        var categorias = await db.Categoria.findAll()
        await db.Receita.findByPk(req.params.id).then(
            receita => res.render('receita/receitaUpdate',
                {
                    receita: receita.dataValues,
                    categorias: categorias.map(categoria => categoria.toJSON())
                })
        ).catch(function (err) {
            console.log(err);
        });
    },
    async postUpdate(req, res) {
        const {nome, ingredientes, preparo, categoriaId} = req.body;
        const imagem = req.imageName;
        await Receita.findOneAndUpdate({_id:req.body.id}, {nome, ingredientes, preparo, categoriaId, imagem}).then(
            res.render('home')
        ).catch(function (err) {
            console.log(err);
        });
    },
    async getDelete(req, res) {
        await db.Receita.destroy({ where: { id: req.params.id } }).then(
            res.render('home')
        ).catch(err => {
            console.log(err);
        });
    }*/
}   