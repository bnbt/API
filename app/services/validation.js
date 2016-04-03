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
                convert: true
            })
        }
    }
};
