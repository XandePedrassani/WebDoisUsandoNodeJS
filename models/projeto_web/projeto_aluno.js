module.exports = (sequelize, Sequelize) => {
    const ProjetoAluno = sequelize.define('projeto_aluno', {
        projetoId: {
            type: Sequelize.INTEGER, allowNull: true
        },
        usuarioId: {
            type: Sequelize.INTEGER, allowNull: true
        }
    });

    return ProjetoAluno;
};
