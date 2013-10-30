exports.index = function(req, res, db){
    res.render('index.html', { title: 'Express' });
};