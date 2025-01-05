const db = require('../config/db_sequelize');
const { QueryTypes } = require('sequelize');

module.exports = {
    async conhecimentosUsuario(req, res) {
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

        const conhecimentosDisponiveis = await db.Conhecimento.findAll();
        res.render('conhecimento/conhecimentoCreate', { alunoId, conhecimentosUsuario, conhecimentosDisponiveis: conhecimentosDisponiveis.map(catg => catg.toJSON()) });
    },
    async getCreate(req, res) {
        res.render('conhecimento/conhecimentoCreateAdmin');
    },
    async postCreate(req, res) {
        try {
            const { nome } = req.body;
            await db.sequelize.query(
                'INSERT INTO conhecimentos (nome, "createdAt", "updatedAt") VALUES (?, ?, ?)',
                { replacements: [nome, new Date(), new Date()], type: QueryTypes.INSERT }
            );
            res.redirect('/conhecimentoList');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    async getList(req, res) {
        try {
            const conhecimentos = await db.sequelize.query('SELECT * FROM conhecimentos', { type: QueryTypes.SELECT });
            res.render('conhecimento/conhecimentoList', { conhecimentos });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar a lista de conhecimentos.');
        }
    },
    async getUpdate(req, res) {
        try {
            const conhecimentoId = req.params.id;
            const conhecimento = await db.sequelize.query(
                'SELECT * FROM conhecimentos WHERE id = ?',
                { replacements: [conhecimentoId], type: QueryTypes.SELECT }
            );
            res.render('conhecimento/conhecimentoUpdate', { conhecimento: conhecimento[0] });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar a página de atualização de conhecimentos.');
        }
    },
    async postUpdate(req, res) {
        try {
            const { id, nome } = req.body;
            await db.sequelize.query(
                'UPDATE conhecimentos SET nome = ?, "updatedAt" = ? WHERE id = ?',
                { replacements: [nome, new Date(), id], type: QueryTypes.UPDATE }
            );
            res.redirect('/conhecimentoList');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    async postDelete(req, res) {
        try {
            const conhecimentoId = req.params.id;

            // aqui eu removo as referências na tabela usuario_conhecimentos
            await db.sequelize.query('DELETE FROM usuario_conhecimentos WHERE "conhecimentoId" = ?', { replacements: [conhecimentoId], type: QueryTypes.DELETE });

            // e deleto o conhecimento
            await db.sequelize.query('DELETE FROM conhecimentos WHERE id = ?', { replacements: [conhecimentoId], type: QueryTypes.DELETE });

            res.redirect('/conhecimentoList');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao deletar o conhecimento.');
        }
    },
    async updateUsuarioConhecimento(req, res) {
        try {
            const [numUpdated] = await db.UsuarioConhecimento.update(req.body, {
                where: {
                    conhecimentoId: req.body.conhecimentoId,
                    usuarioId: req.body.usuarioId,
                },
            });

            if (numUpdated === 0) {
                await db.UsuarioConhecimento.create(req.body);
            }

            res.render('home');
        } catch (err) {
            console.error('Erro ao atualizar ou criar registro:', err);
            res.status(500).send('Erro interno no servidor.');
        }
    },

    async deleteUsuarioConhecimento(req, res) {
        await db.UsuarioConhecimento.destroy({
            where: {
                conhecimentoId: req.params.id,
                usuarioId: req.session.userId,
            },
        }).then(() => res.render('home')
        ).catch(err => {
            console.log(err);
        });
    }
}