exports.index = function(req, res){

    var auditModel = require('../models/audit.js');

    var audit = new auditModel(1, false, function(error, model){
        console.log(model);
    });

    res.render('index.html', { title: 'Express' });
};