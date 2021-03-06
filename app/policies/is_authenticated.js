module.exports = function(req, res, next) {
        var models = req.mycro.models,
            token = req.headers['x-token'];
        if(token === undefined || !token) {
            return res.json(401, {error: 'Unauthorized'});
        }
        models['user'].findOne({
            where: {
                token: token
            }
        }).then(function (user) {
            if (!user) {
                return res.json(403, {error: 'Forbidden'});
            }
            req.user = user;
            next();
        }).catch(function (error) {
            return res.json(500, {error: 'Problem authenticating'});
        });
};
