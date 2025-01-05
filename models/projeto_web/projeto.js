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

    Projeto.associate = (models) => {
        Projeto.belongsToMany(models.PalavraChave, {
            through: 'ProjetoPalavraChave', 
            foreignKey: 'projetoId',
            as: 'PalavrasChave',
            onDelete: 'NO ACTION'
        });
        Projeto.belongsToMany(models.Usuario, {
            as: 'Alunos',
            through: 'ProjetoAluno',
            foreignKey: 'projetoId',
            onDelete: 'NO ACTION'
        });
        Projeto.hasMany(models.ProjetoAluno, { foreignKey: 'projetoId', as: 'ProjetoAlunos' });
    };

    return Projeto;
};
