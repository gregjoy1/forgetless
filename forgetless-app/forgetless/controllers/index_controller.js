module.exports = {
    index: function(request, response) {
        response.render('index.html', { title: 'Express' });
    },
    app: function(request, response) {
        response.render('app.html', { title: 'App' });
    }
};

