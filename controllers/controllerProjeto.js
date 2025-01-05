const { QueryTypes } = require('sequelize');
const db = require('../config/db_sequelize');

module.exports = {
    async getCreate(req, res) {
        try {
            const usuarios = await db.sequelize.query('SELECT * FROM usuarios', { type: QueryTypes.SELECT });
            const palavraChave = await db.sequelize.query('SELECT * FROM palavra_chaves', { type: QueryTypes.SELECT });
            res.render('projeto/projetoCreate', { 
                usuarios,
                palavraChave
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar a página de criação de projetos.');
        }
    },
    async postCreate(req, res) {
        try {
            const { nome, resumo, link_externo, usuarioIds = [], palavraChaveIds = [] } = req.body;

            const now = new Date();

            const projeto = await db.sequelize.query(
                'INSERT INTO projetos (nome, resumo, link_externo, "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?) RETURNING id',
                { replacements: [nome, resumo, link_externo, now, now], type: QueryTypes.INSERT }
            );

            const projetoId = projeto[0][0].id;

            const currentUserId = req.user.id;
            const usuarioIdsArray = Array.isArray(usuarioIds) ? usuarioIds : [usuarioIds];
            const allUsuarioIds = [currentUserId, ...usuarioIdsArray];
            const palavraChaveIdsArray = Array.isArray(palavraChaveIds) ? palavraChaveIds : [palavraChaveIds];

            if (allUsuarioIds.length > 0) {
                const projetoAlunos = allUsuarioIds.map(usuarioId => [projetoId, usuarioId, now, now]);
                await db.sequelize.query(
                    'INSERT INTO projeto_alunos ("projetoId", "usuarioId", "createdAt", "updatedAt") VALUES ?',
                    { replacements: [projetoAlunos], type: QueryTypes.INSERT }
                );
            }

            if (palavraChaveIdsArray.length > 0) {
                const projetoPalavraChaves = palavraChaveIdsArray.map(palavraChaveId => [projetoId, palavraChaveId, now, now]);
                await db.sequelize.query(
                    'INSERT INTO projeto_palavra_chaves ("projetoId", "palavraChaveId", "createdAt", "updatedAt") VALUES ?',
                    { replacements: [projetoPalavraChaves], type: QueryTypes.INSERT }
                );
            }

            res.redirect('/projetoCreate');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    async getList(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send('Usuário não autenticado');
            }

            const usuarioId = req.user.id;

            const projetos = await db.sequelize.query(
                'SELECT DISTINCT p.id, p.nome, p.resumo, p.link_externo FROM projetos p ' +
                'JOIN projeto_alunos pa ON p.id = pa."projetoId" ' +
                'WHERE pa."usuarioId" = ?',
                { replacements: [usuarioId], type: QueryTypes.SELECT }
            );

            for (const projeto of projetos) {
                const alunos = await db.sequelize.query(
                    'SELECT u.id, u.login FROM usuarios u ' +
                    'JOIN projeto_alunos pa ON u.id = pa."usuarioId" ' +
                    'WHERE pa."projetoId" = ?',
                    { replacements: [projeto.id], type: QueryTypes.SELECT }
                );
                projeto.Alunos = alunos;

                const palavrasChave = await db.sequelize.query(
                    'SELECT pc.id, pc.nome FROM palavra_chaves pc ' +
                    'JOIN projeto_palavra_chaves ppc ON pc.id = ppc."palavraChaveId" ' +
                    'WHERE ppc."projetoId" = ?',
                    { replacements: [projeto.id], type: QueryTypes.SELECT }
                );
                projeto.PalavrasChave = palavrasChave;
            }

            res.render('projeto/projetoList', {
                projetos
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar a lista de projetos.');
        }
    },
    async getUpdate(req, res) {
        try {
            const projetoId = req.params.id;

            const projeto = await db.sequelize.query(
                'SELECT * FROM projetos WHERE id = ?',
                { replacements: [projetoId], type: QueryTypes.SELECT }
            );

            const palavraChave = await db.sequelize.query('SELECT * FROM palavra_chaves', { type: QueryTypes.SELECT });
            const alunos = await db.sequelize.query('SELECT * FROM usuarios WHERE tipo = 1', { type: QueryTypes.SELECT });

            const projetoAlunos = await db.sequelize.query(
                'SELECT u.id, u.login FROM usuarios u ' +
                'JOIN projeto_alunos pa ON u.id = pa."usuarioId" ' +
                'WHERE pa."projetoId" = ?',
                { replacements: [projetoId], type: QueryTypes.SELECT }
            );

            const projetoPalavrasChave = await db.sequelize.query(
                'SELECT pc.id, pc.nome FROM palavra_chaves pc ' +
                'JOIN projeto_palavra_chaves ppc ON pc.id = ppc."palavraChaveId" ' +
                'WHERE ppc."projetoId" = ?',
                { replacements: [projetoId], type: QueryTypes.SELECT }
            );

            const alunosFiltrados = alunos.filter(aluno => !projetoAlunos.some(pa => pa.id === aluno.id));

            res.render('projeto/projetoUpdate', {
                projeto: projeto[0],
                palavraChave,
                alunos: alunosFiltrados,
                projetoAlunos,
                projetoPalavrasChave
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar a página de atualização de projetos.');
        }
    },
    async postUpdate(req, res) {
        try {
            const { id, nome, resumo, link_externo, usuarioIds = [], palavraChaveIds = [] } = req.body;

            const now = new Date();

            await db.sequelize.query(
                'UPDATE projetos SET nome = ?, resumo = ?, link_externo = ?, "updatedAt" = ? WHERE id = ?',
                { replacements: [nome, resumo, link_externo, now, id], type: QueryTypes.UPDATE }
            );

            await db.sequelize.query('DELETE FROM projeto_alunos WHERE "projetoId" = ?', { replacements: [id], type: QueryTypes.DELETE });
            const currentUserId = req.user.id;
            const usuarioIdsArray = Array.isArray(usuarioIds) ? usuarioIds : [usuarioIds];
            const allUsuarioIds = [currentUserId, ...usuarioIdsArray];
            if (allUsuarioIds.length > 0) {
                const projetoAlunos = allUsuarioIds.map(usuarioId => [id, usuarioId, now, now]);
                await db.sequelize.query(
                    'INSERT INTO projeto_alunos ("projetoId", "usuarioId", "createdAt", "updatedAt") VALUES ?',
                    { replacements: [projetoAlunos], type: QueryTypes.INSERT }
                );
            }

            await db.sequelize.query('DELETE FROM projeto_palavra_chaves WHERE "projetoId" = ?', { replacements: [id], type: QueryTypes.DELETE });
            const palavraChaveIdsArray = Array.isArray(palavraChaveIds) ? palavraChaveIds : [palavraChaveIds];
            if (palavraChaveIdsArray.length > 0) {
                const projetoPalavraChaves = palavraChaveIdsArray.map(palavraChaveId => [id, palavraChaveId, now, now]);
                await db.sequelize.query(
                    'INSERT INTO projeto_palavra_chaves ("projetoId", "palavraChaveId", "createdAt", "updatedAt") VALUES ?',
                    { replacements: [projetoPalavraChaves], type: QueryTypes.INSERT }
                );
            }

            res.redirect('/projetoUpdate/' + id);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    async postUpdatePalavrasChave(req, res) {
        try {
            const { projetoId, palavraChaveIds = [] } = req.body;

            const now = new Date();

            await db.sequelize.query('DELETE FROM projeto_palavra_chaves WHERE "projetoId" = ?', { replacements: [projetoId], type: QueryTypes.DELETE });
            const palavraChaveIdsArray = Array.isArray(palavraChaveIds) ? palavraChaveIds : [palavraChaveIds];
            if (palavraChaveIdsArray.length > 0) {
                const projetoPalavraChaves = palavraChaveIdsArray.map(palavraChaveId => [projetoId, palavraChaveId, now, now]);
                await db.sequelize.query(
                    'INSERT INTO projeto_palavra_chaves ("projetoId", "palavraChaveId", "createdAt", "updatedAt") VALUES ?',
                    { replacements: [projetoPalavraChaves], type: QueryTypes.INSERT }
                );
            }

            res.redirect('/projetoUpdate/' + projetoId);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    async deleteProjeto(req, res) {
        try {
            const projetoId = req.params.id;

            await db.sequelize.query('DELETE FROM projeto_alunos WHERE "projetoId" = ?', { replacements: [projetoId], type: QueryTypes.DELETE });
            await db.sequelize.query('DELETE FROM projeto_palavra_chaves WHERE "projetoId" = ?', { replacements: [projetoId], type: QueryTypes.DELETE });
            await db.sequelize.query('DELETE FROM projetos WHERE id = ?', { replacements: [projetoId], type: QueryTypes.DELETE });

            res.redirect('/projetoList');
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao deletar o projeto.');
        }
    },

    async getVisualizarProjetos(req, res) {
        try {
            const projetos = await db.sequelize.query(
                'SELECT p.id, p.nome, p.resumo, p.link_externo FROM projetos p',
                { type: QueryTypes.SELECT }
            );

            for (const projeto of projetos) {
                const alunos = await db.sequelize.query(
                    'SELECT u.id, u.login FROM usuarios u ' +
                    'JOIN projeto_alunos pa ON u.id = pa."usuarioId" ' +
                    'WHERE pa."projetoId" = ?',
                    { replacements: [projeto.id], type: QueryTypes.SELECT }
                );
                projeto.Alunos = alunos;

                const palavrasChave = await db.sequelize.query(
                    'SELECT pc.id, pc.nome FROM palavra_chaves pc ' +
                    'JOIN projeto_palavra_chaves ppc ON pc.id = ppc."palavraChaveId" ' +
                    'WHERE ppc."projetoId" = ?',
                    { replacements: [projeto.id], type: QueryTypes.SELECT }
                );
                projeto.PalavrasChave = palavrasChave;
            }

            const palavrasChaveDisponiveis = await db.sequelize.query(
                'SELECT * FROM palavra_chaves',
                { type: QueryTypes.SELECT }
            );

            res.render('visualizar/visualizarProjetos', {
                projetos,
                palavrasChaveDisponiveis
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar a lista de projetos.');
        }
    },

    async getVisualizarProjetosFiltrados(req, res) {
        try {
            const { palavraChave } = req.query;

            let projetos;
            if (palavraChave) {
                projetos = await db.sequelize.query(
                    'SELECT DISTINCT p.id, p.nome, p.resumo, p.link_externo FROM projetos p ' +
                    'JOIN projeto_palavra_chaves ppc ON p.id = ppc."projetoId" ' +
                    'JOIN palavra_chaves pc ON ppc."palavraChaveId" = pc.id ' +
                    'WHERE pc.nome ILIKE ?',
                    { replacements: [`%${palavraChave}%`], type: QueryTypes.SELECT }
                );
            } else {
                projetos = await db.sequelize.query(
                    'SELECT p.id, p.nome, p.resumo, p.link_externo FROM projetos p',
                    { type: QueryTypes.SELECT }
                );
            }

            for (const projeto of projetos) {
                const alunos = await db.sequelize.query(
                    'SELECT u.id, u.login FROM usuarios u ' +
                    'JOIN projeto_alunos pa ON u.id = pa."usuarioId" ' +
                    'WHERE pa."projetoId" = ?',
                    { replacements: [projeto.id], type: QueryTypes.SELECT }
                );
                projeto.Alunos = alunos;

                const palavrasChave = await db.sequelize.query(
                    'SELECT pc.id, pc.nome FROM palavra_chaves pc ' +
                    'JOIN projeto_palavra_chaves ppc ON pc.id = ppc."palavraChaveId" ' +
                    'WHERE ppc."projetoId" = ?',
                    { replacements: [projeto.id], type: QueryTypes.SELECT }
                );
                projeto.PalavrasChave = palavrasChave;
            }

            const palavrasChaveDisponiveis = await db.sequelize.query(
                'SELECT * FROM palavra_chaves',
                { type: QueryTypes.SELECT }
            );

            res.render('visualizar/visualizarProjetos', {
                projetos,
                palavrasChaveDisponiveis
            });
        } catch (err) {
            console.log(err);
            res.status(500).send('Erro ao carregar a lista de projetos.');
        }
    }
}