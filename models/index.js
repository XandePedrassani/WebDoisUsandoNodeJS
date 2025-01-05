const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql', // Ajuste o dialeto conforme necessário
    logging: console.log, // Ativa logs do Sequelize para depuração
});

const db = {};

// Importa os modelos
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require('./relational/usuario')(sequelize, Sequelize.DataTypes);
db.Projeto = require('./projeto_web/projeto')(sequelize, Sequelize.DataTypes);
db.ProjetoAluno = require('./projeto_web/projeto_aluno')(sequelize, Sequelize.DataTypes);
db.ProjetoPalavraChave = require('./projeto_web/projeto_palavra_chave')(sequelize, Sequelize.DataTypes);
db.PalavraChave = require('./projeto_web/palavra_chave')(sequelize, Sequelize.DataTypes);

// Configurar associações (chama associate somente se definido)
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;