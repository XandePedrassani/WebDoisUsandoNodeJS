const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres2', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true
  });

var db = {};
db.sequelize = sequelize;
db.Receita = require('../models/relational/receita.js')(sequelize, Sequelize);

//Parte nova
db.Usuario = require('../models/relational/usuario.js')(sequelize, Sequelize); //Mesmo que o exemplo
db.Projeto = require('../models/projeto_web/projeto.js')(sequelize, Sequelize);
db.PalavraChave = require('../models/projeto_web/palavra_chave.js')(sequelize, Sequelize);
db.Conhecimento = require('../models/projeto_web/conhecimento.js')(sequelize, Sequelize);
db.UsuarioConhecimento = require('../models/projeto_web/usuario_conhecimento.js')(sequelize, Sequelize);
db.ProjetoPalavraChave = require('../models/projeto_web/projeto_palavra_chave.js')(sequelize, Sequelize);
db.ProjetoAluno = require('../models/projeto_web/projeto_aluno.js')(sequelize, Sequelize);

// Relacionamento: Aluno pode ter muitos Projetos (muitos para muitos)
db.Usuario.hasMany(db.ProjetoAluno, {foreignKey:'usuarioId', onDelete: 'NO ACTION'});
db.Projeto.hasMany(db.ProjetoAluno, {foreignKey:'projetoId', onDelete: 'NO ACTION'});

// Relacionamento muitos-para-muitos entre Projeto e PalavraChave
db.PalavraChave.hasMany(db.ProjetoPalavraChave, {foreignKey:'palavraChaveId', onDelete: 'NO ACTION'});
db.Projeto.hasMany(db.ProjetoPalavraChave, {foreignKey:'projetoId', onDelete: 'NO ACTION'});

// Relacionamento: Aluno pode ter muitos Conhecimentos (muitos para muitos com nível)
db.Usuario.hasMany(db.UsuarioConhecimento, {foreignKey:'usuarioId', onDelete: 'NO ACTION'});
db.Conhecimento.hasMany(db.UsuarioConhecimento, {foreignKey:'conhecimentoId', onDelete: 'NO ACTION'});

module.exports = db;

