module.exports.index = function(req, res){
    GLOBAL.defs.HashHelper.HashEmailPassword('email', 'password', function(hash) {
        console.log(hash);
    }, 'testsalt');
    res.render('index.html', { title: 'Express' });
};