const { QueryTypes } = require('sequelize');
const db = require('../config/db_sequelize');

module.exports = {
    async getRelatorio(req, res) {
        try {
            const conhecimentos = await db.sequelize.query(
                'SELECT c.nome, COUNT(uc."usuarioId") as total_alunos, ROUND(AVG(uc.nivel), 1) as nivel_medio ' +
                'FROM conhecimentos c ' +
                'JOIN usuario_conhecimentos uc ON c.id = uc."conhecimentoId" ' +
                'GROUP BY c.nome',
                { type: QueryTypes.SELECT }
            );

            res.render('visualizar/relatorio', {
                conhecimentos
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar o relatório.');
        }
    }
}
