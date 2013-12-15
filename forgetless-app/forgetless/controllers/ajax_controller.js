module.exports.dump = function(req, res){
    GLOBAL.defs.ListHelper.getCompleteJSONDump(1, function(err, object) {
        res.end(JSON.stringify(object));
        console.log(JSON.stringify(object));
    });
};

module.exports.login = function(req, res){

    if(req.cookies.usertoken != null) {
        if(req.body.email != undefined && req.body.password != undefined) {

        }
    }
};
