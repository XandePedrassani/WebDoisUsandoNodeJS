const db = require('../config/db_sequelize');
const path = require('path');
const conhecimento = require('../models/projeto_web/conhecimento');
const { QueryTypes } = require('sequelize');

module.exports = {
    async conhecimentosUsuario(req, res){
        const alunoId = req.session.userId;

        const results = await db.sequelize.query(`
            SELECT 
                c.id AS "conhecimentoId",
                c.nome AS "conhecimentoNome",
                uc.nivel AS "conhecimentoNivel"
            FROM 
                usuario_conhecimentos uc
            INNER JOIN 
                conhecimentos c ON uc."conhecimentoId" = c.id
            WHERE 
                uc."usuarioId" = :usuarioId;
        `, {
            replacements: { usuarioId: alunoId },
            type: QueryTypes.SELECT,
        });

        const conhecimentosUsuario = results.map(row => ({
            conhecimentoId: row.conhecimentoId,
            conhecimentoNome: row.conhecimentoNome,
            conhecimentoNivel: row.conhecimentoNivel,
        }));
          
       // const usuarioConhecimentos = results.rows // Call toJSON if it exists
        // Retorna os resultados
        const conhecimentosDisponiveis = await db.Conhecimento.findAll();
        console.log(conhecimentosUsuario);
        res.render('conhecimento/conhecimentoCreate', {alunoId, conhecimentosUsuario, conhecimentosDisponiveis: conhecimentosDisponiveis.map(catg => catg.toJSON())});
    },
    async getUpdate(req, res) {

        try {
            const [numUpdated] = await db.UsuarioConhecimento.update(req.body, {
              where: {
                conhecimentoId: req.body.conhecimentoId,
                usuarioId: req.body.usuarioId,
              },
            });
          
            if (numUpdated === 0) {
              console.log('Nenhum registro encontrado para atualizar. Criando um novo registro...');
              // Criando o registro se não existir
              await db.UsuarioConhecimento.create(req.body);
            }
          
            res.render('home');
          } catch (err) {
            console.error('Erro ao atualizar ou criar registro:', err);
            res.status(500).send('Erro interno no servidor.');
          }
    },

    async getDelete(req, res) {
        await db.UsuarioConhecimento.destroy({ 
            where: {
                conhecimentoId: req.params.id,
                usuarioId: req.session.userId,
              },
            }).then(res.render('home')
        ).catch(err => {
            console.log(err);
        });
    }
}   