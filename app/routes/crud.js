module.exports = function(mycro) {
    return {
        get: {
            additionalPolicies: [
                mycro.services['validation'].paginationValidation()
            ],
            handler: 'crud.find'
        },
        put: 'crud.create',
        '/:id': {
            policies: [
                mycro.services['validation'].entityId()
            ],
            del: 'crud.destroy',
            get: 'crud.findOne',
            post: 'crud.update'
        }
    }
};
