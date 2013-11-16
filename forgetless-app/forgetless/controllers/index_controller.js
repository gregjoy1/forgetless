exports.index = function(req, res){

    var listHelper = GLOBAL.defs.ListHelper;

    listHelper.getCompleteJSONDump(1, function(err, object) {
        res.end(JSON.stringify(object));
        console.log(JSON.stringify(object));
    });

//    res.render('index.html', { title: 'Express' });
};