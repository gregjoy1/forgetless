module.exports.index = function(req, res){
    GLOBAL.defs.HashHelper.HashEmailPassword('email', 'password', function(hash) {
        console.log(hash);
    }, 'testsalt');
    GLOBAL.defs.LogHelper.WriteToLog('test entry!', function(){});
    res.render('index.html', { title: 'Express' });
};