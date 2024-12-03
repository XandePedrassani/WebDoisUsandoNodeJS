1- Rode o comando "npm install";
2- Verifique o arquivo "db_sequelize" e adicione o seu banco local nele, de preferencia crie oque ja tem no projeto em sua maquina;
3- Existe esse código comentado:
/*db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true }');
});*/
//db.Usuario.create({login:'admin', senha:'1234', tipo:2});
Rode uma vez com ele descomentado para criar o usuario padrão em seu banco.
4- Para rodar use o comando "node app.js"
