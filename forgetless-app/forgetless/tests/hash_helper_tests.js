var hashHelper = require('../helpers/hash_helper.js');

exports['Hash String Test'] = function(test) {

    test.expect(1);

    hashHelper.HashString('testing', function(hash) {
        test.equal('dc724af18fbdd4e59189f5fe768a5f8311527050', hash);
        test.done();
    });

};

exports['Hash Email Password Test'] = function(test) {

    test.expect(1);

    hashHelper.HashEmailPassword('email', 'password', function(hash) {
        test.equal('b24034ed5c5de3388037280c15533fe74fa0dbb7', hash);
        test.done();
    }, 'testsalt');

};

exports['Hash Email Password Match Test'] = function(test) {

    test.expect(1);

    hashHelper.EmailPasswordHashMatch(
        'b24034ed5c5de3388037280c15533fe74fa0dbb7',
        'email',
        'password',
        function(match) {
            test.ok(match, "Hash does not match...");
            test.done();
        },
        'testsalt'
    );

};