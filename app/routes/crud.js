module.exports = {
    get: 'crud.find',
    put: 'crud.create',
    '/:id': {
        del: 'crud.destroy',
        get: 'crud.findOne',
        post: 'crud.update'
    }
};