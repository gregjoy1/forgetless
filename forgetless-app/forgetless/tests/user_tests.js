require('../config/global_definitions.js')(false, false);

var testUser = false;

module.exports = {
    "Creating and saving new user": function(test) {
        GLOBAL.defs.User(null, null, function(err, user) {
            user.createNewUser(
                'title',
                'first-name',
                'last-name',
                'email',
                'password',
                function(err, user) {
                    test.equal(err, null, 'Save Query Failed: ' + err);
                    testUser = user;
                    test.done();
                }
            );
        });
    },
    "Testing if user was actually inserted": function(test) {
        GLOBAL.defs.User(testUser.id, null, function(err, user) {
            test.equal(err, false, 'Could not load model');
            testUser = user;
            test.done();
        });
    },
    "Validating Title": function(test) {
        test.equal(testUser.title, 'title', 'Title Does Not Match');
        test.done();
    },
    "Validating First Name": function(test) {
        test.equal(testUser.firstName, 'first-name', 'First Name Does Not Match');
        test.done();
    },
    "Validating Last Name": function(test) {
        test.equal(testUser.lastName, 'last-name', 'Last Name Does Not Match');
        test.done();
    },
    "Validating Email": function(test) {
        test.equal(testUser.email, 'email', 'Email Does Not Match');
        test.done();
    },
    "Validating Zone ID": function(test) {
        test.equal(testUser.zoneId, 1, 'Zone ID Does Not Match');
        test.done();
    },
    "Validating Password": function(test) {
        GLOBAL.defs.HashHelper.HashEmailPassword(testUser.email, 'password', function(hash) {
            test.equal(testUser.passwordHash, hash, 'Password Hash Does Not Match');
            test.done();
        });
    },
    "Changing Password": function(test) {
        testUser.generateNewPasswordHash('password2', function(model) {
            GLOBAL.defs.HashHelper.HashEmailPassword(testUser.email, 'password2', function(hash) {
                testUser = model;
                test.equal(testUser.passwordHash, hash, 'Changed Password Hash Does Not Match');
                test.done();
            });
        });
    },
    "Disabling User": function(test) {
        testUser.disableUser(function(model) {
            testUser = model;
            test.equal(testUser.zoneId, 0, 'User Not Disabled');
            test.done();
        });
    },
    "Deleting User": function(test) {
        var sql = "DELETE FROM user WHERE id = ?";

        escapeArray = testUser.id;

        if(typeof testUser.id == "number") {
            GLOBAL.dbPool.getConnection(function(err, connection){
                connection.query(sql, escapeArray, function(err, rows){
                    test.ok(!err, "Some error when running delete query: " + err);
                    test.done();
                    connection.release();
                });
            });
        } else {
            test.ok(false, "Cannot delete because does not have valid id.");
            test.done();
        }
    }
};