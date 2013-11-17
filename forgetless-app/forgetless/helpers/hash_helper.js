module.exports = {
    _sha1:require('sha1'),
    HashString:function(string, callback) {
        callback(this._sha1(string));
    },
    HashEmailPassword:function(email, password, callback){
        callback(this._sha1(email + GLOBAL.config.pw_salt + password));
    },
    EmailPasswordHashMatch:function(hash, email, password, callback){
        this.HashEmailPassword(email, password, function(generatedHash){
            callback(hash == generatedHash);
        });
    }
};