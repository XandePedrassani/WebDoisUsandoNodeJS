module.exports = {
    logRegister(req, res, next) {
        console.log(req.url + req.method + new Date())
        next();
    },
    sessionControl(req, res, next) {
        if (req.session.login != undefined) {
            res.locals.login = req.session.login;
            
            if (!req.user) req.user = {};
            req.user.id = req.session.userId;

            if (req.session.tipo == 2) {
                res.locals.admin = true;
            } else if (req.session.tipo == 1){
                res.locals.aluno = true;
            } else if (req.session.tipo == 3){
                res.locals.externo = true;
            }
            next();
        }
        else if ((req.url == '/') && (req.method == 'GET')) next();
        else if ((req.url == '/login') && (req.method == 'POST')) next();
        else res.redirect('/');
    }
};