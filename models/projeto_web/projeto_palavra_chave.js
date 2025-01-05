module.exports = (sequelize, Sequelize) => {
    const ProjetoPalavraChave = sequelize.define('projeto_palavra_chave', {
        projetoId: {
            type: Sequelize.INTEGER, allowNull: true
        },
        palavraChaveId: {
            type: Sequelize.INTEGER, allowNull: true
        }
    });

    ProjetoPalavraChave.associate = (models) => {
        ProjetoPalavraChave.belongsTo(models.Projeto, { foreignKey: 'projetoId' });
        ProjetoPalavraChave.belongsTo(models.PalavraChave, { foreignKey: 'palavraChaveId' });
    };

    return ProjetoPalavraChave;
};
