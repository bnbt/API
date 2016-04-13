module.exports = function (roleName) {

    return function(req, res, next) {
        var models = req.mycro.models,
            token = req.headers['x-token'];
            if(token === undefined || !token) {
                res.json(401, {error: 'Unauthorized'});
                res.end();
            }
        models['user'].findOne({
            where: {
                token: token
            },
            include: [{
                model: models['role'],
                where: {role_name: roleName}
            }]
        }).then(function (user) {
            if (!user) {
                res.json(403, {error: 'Forbidden'});
                return res.end();
            }
            req.user = user;
            next();
        }).catch(function () {
            res.json(500, {error: 'Problem authenticating'});
            res.end();
        });
    }

};
