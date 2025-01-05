module.exports = (sequelize, Sequelize) => {
    const ProjetoAluno = sequelize.define('projeto_aluno', {
        projetoId: {
            type: Sequelize.INTEGER, allowNull: true
        },
        usuarioId: {
            type: Sequelize.INTEGER, allowNull: true
        }
    });

    ProjetoAluno.associate = (models) => {
        ProjetoAluno.belongsTo(models.Projeto, { foreignKey: 'projetoId', as: 'Projeto' });
        ProjetoAluno.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });
    };

    return ProjetoAluno;
};
