module.exports.dump = function(req, res){
    GLOBAL.defs.ListHelper.getCompleteJSONDump(1, function(err, object) {
        res.end(JSON.stringify(object));
        console.log(JSON.stringify(object));
    });

};