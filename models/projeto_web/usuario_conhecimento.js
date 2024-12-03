module.exports = (sequelize, Sequelize) => {
    const UsuarioConhecimento = sequelize.define('usuario_conhecimento', {
        usuarioId: {
            type: Sequelize.INTEGER, allowNull: true
        },
        conhecimentoId: {
            type: Sequelize.INTEGER, allowNull: true
        },
        nivel: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 10
            }
        }
    });

    return UsuarioConhecimento;
};
