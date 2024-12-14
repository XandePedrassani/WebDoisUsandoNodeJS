module.exports = (sequelize, Sequelize) => {
    const Projeto = sequelize.define('projeto', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        resumo: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        link_externo: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    /*Projeto.associate = (models) => {
        Projeto.belongsToMany(models.PalavraChave, {
            through: models.ProjetoPalavraChave, // A tabela de junção
            foreignKey: 'projetoId', // Chave estrangeira na tabela de junção
            onDelete: 'NO ACTION' // Ação no delete
        });
    };

    Projeto.associate = (models) => {
        Projeto.belongsToMany(models.ProjetoAlunos, {
            through: models.ProjetoPalavraChave, // A tabela de junção
            foreignKey: 'projetoId', // Chave estrangeira na tabela de junção
            onDelete: 'NO ACTION' // Ação no delete
        });
    };*/

    return Projeto;
};
