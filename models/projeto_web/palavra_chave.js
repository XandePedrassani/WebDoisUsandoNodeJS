module.exports = (sequelize, Sequelize) => {
    const PalavraChave = sequelize.define('palavra_chave', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    PalavraChave.associate = (models) => {
        PalavraChave.belongsToMany(models.Projeto, {
            through: 'ProjetoPalavraChave',
            foreignKey: 'palavraChaveId',
            as: 'Projetos',
            onDelete: 'NO ACTION'
        });
    };

    return PalavraChave;
};
