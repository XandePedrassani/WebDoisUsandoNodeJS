const { where } = require('sequelize');
const db = require('../config/db_sequelize');
const path = require('path');

module.exports = {
    async getCreate(req, res) {
        var palavraChave = await db.PalavraChave.findAll()
        var alunos = await db.Usuario.findAll({where:{tipo: 1}})

        res.render('projeto/projetoCreate', {
            palavraChave: palavraChave.map(palavraChave => palavraChave.toJSON()),
            alunos: alunos.map(alunos => alunos.toJSON())
        });
    },
    async postCreate(req, res) {
        const {nome, resumo, link_externo, palavraChave, alunos} = req.body;
        try{
            const novoProjeto = await db.Projeto.create({nome, resumo, link_externo})
            const novoProjetoId = novoProjeto.dataValues.id

            palavraChave.forEach(async(element) => {
                await db.ProjetoPalavraChave.create({projetoId: novoProjetoId, palavraChaveId: element})
            });

            alunos.forEach(async(element) => {
                await db.ProjetoAluno.create({projetoId: novoProjetoId, usuarioId: element})
            });

            res.redirect('/home')
        } catch(err){
            console.log(err);
        }
    },
    async getList(req, res) {
        console.log("rqweqwe")
        db.Projeto.findAll().then(projetos => {
            res.render('projeto/projetoList',
                { projetos: projetos.map(projetos => projetos.toJSON()) });
        }).catch((err) => {
            console.log(err);
        });
    },
    async getUpdate(req, res) {
        var palavraChave = await db.PalavraChave.findAll()
        var alunos = await db.Usuario.findAll({where:{tipo: 1}})

        await db.Projeto.findByPk(req.params.id).then(
            projeto => res.render('projeto/projetoUpdate',
                {
                    projeto: projeto.dataValues,
                    palavraChave: palavraChave.map(palavraChave => palavraChave.toJSON()),
                    alunos: alunos.map(alunos => alunos.toJSON())
                })
        ).catch(function (err) {
            console.log(err);
        });
    },
    async getDelete(req, res) {
        try {
            // Transação
            const transaction = await db.sequelize.transaction();
            
            // Deleta todas as relações pois não tem CASCADE

            // Relação Projeto -> Aluno
            await db.ProjetoAluno.destroy({ where: {projetoId: req.params.id }});

            // Relação Projeto -> PalavraChave
            await db.ProjetoPalavraChave.destroy({ where: {projetoId: req.params.id }})

            // Projeto
            await db.Projeto.destroy({ where: { id: req.params.id } });
           
            // Commit
            await transaction.commit();

            res.render('home')
        } catch(err) { 
            console.log(err);
            await transaction.rollback();
        }
        
        
        
        /* await db.Projeto.destroy({ where: { id: req.params.id } }).then(
            res.render('home')
        ).catch(err => {
            console.log(err);
        });*/
    }
/*    async postUpdate(req, res) {
        const {nome, ingredientes, preparo, categoriaId} = req.body;
        const imagem = req.imageName;
        await Receita.findOneAndUpdate({_id:req.body.id}, {nome, ingredientes, preparo, categoriaId, imagem}).then(
            res.render('home')
        ).catch(function (err) {
            console.log(err);
        });
    },
*/
}   