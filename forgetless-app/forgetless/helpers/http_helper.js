module.exports = {
    ValidateAndCollatePOSTSubmission: function(request, expectedFields, callback) {
        var success = !(request.body.length == 0 || expectedFields.length == 0);
        var object = {};

        for(var inc = 0; inc < expectedFields.length; inc++) {
            var field = request.body[expectedFields[inc].name];
            // checks if field exists
            if(field == undefined) {
                // if required and not found then fail
                if(expectedFields[inc].required) {
                    success = false;
                // if not required and not found then add as null
                } else {
                    object[expectedFields[inc].name] = null;
                }
            } else {
                // checks if found field is the right type
                switch(expectedFields[inc].type){
                    case 'number':
                        if(isNaN(parseInt(field))) {
                            success = false;
                        } else {
                            object[expectedFields[inc].name] = parseInt(field);
                        }
                        break;
                    case 'float':
                        if(isNaN(parseFloat(field))) {
                            success = false;
                        } else {
                            object[expectedFields[inc].name] = parseFloat(field);
                        }
                        break;
                    case 'string':
                    default:
                        object[expectedFields[inc].name] = field;
                        break;
                }
            }
        }
        callback(success, object);
    }
};