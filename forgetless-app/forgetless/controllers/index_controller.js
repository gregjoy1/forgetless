exports.index = function(req, res){

    var listHelper = GLOBAL.defs.ListHelper;

    listHelper.getSchemaDrop(1, function(err, object) {
        console.log(object);
    });

    res.render('index.html', { title: 'Express' });
};