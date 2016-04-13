module.exports = function (mycro) {
    return {
        deviceHeader: function () {
            return mycro.policies.validate('headers', function (joi) {
                return joi.object({
                    device: joi.string().required()
                }).required();
            }, {
                stripUnknown: true,
                convert: false
            })
        },
        deviceStateQuery: function() {
            return mycro.policies.validate('query', function (joi) {
                return joi.object({
                    s: joi.number().integer().required(),
                    u: joi.number().integer().required()
                }).required();
            }, {
                stripUnknown: true,
                allowUnknown: true,
                convert: true
            })
        },
        entityId: function() {
            // TODO: REMOVE HARDCODE FROM node_modules
            return mycro.policies.validate('params', function (joi) {
                return joi.object({
                    id: joi.number().required()
                }).required();
            }, {
                convert: true,
                stripUnknown: false,
                allowUnknown: true
            })
        },
        hasCredentials: function() {
            return mycro.policies.validate('body', function (joi) {
                return joi.object({
                    username: joi.string().required(),
                    password: joi.string().required()
                }).required();
            }, {
                convert: true,
                stripUnknown: true,
                allowUnknown: false
            })
        }
    }
};
