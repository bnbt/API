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
        },
        stateValidation: function() {
            return mycro.policies.validate('body', function (joi) {
                return joi.object({
                    state_name: joi.string().required(),
                    red: joi.number().integer(),
                    green: joi.number().integer(),
                    blue: joi.number().integer(),
                    is_request: joi.alternatives().try(joi.number().integer(), joi.boolean())
                }).required();
            }, {
                convert: true,
                stripUnknown: true,
                allowUnknown: false
            })
        },
        roleValidation: function() {
            return mycro.policies.validate('body', function (joi) {
                return joi.object({
                    role_name: joi.string().required(),
                    description: joi.string()
                }).required();
            }, {
                convert: true,
                stripUnknown: true,
                allowUnknown: false
            })
        },
        userValidation: function() {
            return mycro.policies.validate('body', function (joi) {
                return joi.object({
                    user_AD: joi.string().required(),
                    role_id: joi.number().integer()
                }).required();
            }, {
                convert: true,
                stripUnknown: true,
                allowUnknown: false
            })
        },
        deviceValidation: function() {
            return mycro.policies.validate('body', function (joi) {
                return joi.object({
                    device_id: joi.string().required(),
                    name: joi.string(),
                    description: joi.string(),
                    active: joi.alternatives().try(joi.number().integer(), joi.boolean()),
                    requires_rfid: joi.alternatives().try(joi.number().integer(), joi.boolean())
                }).required();
            }, {
                convert: true,
                stripUnknown: true,
                allowUnknown: false
            })
        }
    }
};
