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

    return PalavraChave;
};
