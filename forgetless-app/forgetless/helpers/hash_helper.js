module.exports = {

    _sha1:require('sha1'),

    HashString:function(string, callback) {
        callback(this._sha1(string));
    },

    HashEmailPassword:function(email, password, callback, overrideSalt){
        var salt = (overrideSalt == undefined ? GLOBAL.config.pw_salt : overrideSalt);
        callback(this._sha1(email + salt + password));
    },

    EmailPasswordHashMatch:function(hash, email, password, callback, overrideSalt){
        this.HashEmailPassword(email, password, function(generatedHash){
            callback(hash == generatedHash);
        }, overrideSalt);
    },

    GenerateHashToken:function(uniqueString, callback){
        var timestamp = new Date().getTime();
        this.HashString(timestamp + GLOBAL.config.token_salt + uniqueString, callback);
    }

};