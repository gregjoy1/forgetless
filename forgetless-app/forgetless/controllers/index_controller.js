module.exports.index = function(req, res){
    GLOBAL.defs.HashHelper.HashEmailPassword('email', 'password', function(hash) {
        console.log(hash);
    }, 'testsalt');
    GLOBAL.defs.ItemHelper.FindItemStack(1, 1, 1, function(err, itemLink) {
        console.log(err, JSON.stringify(itemLink));
    });
    res.render('index.html', { title: 'Express' });
};