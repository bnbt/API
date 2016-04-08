module.exports = function(mycro) {
    return {
        get: 'crud.find',
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
