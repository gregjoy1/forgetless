module.exports = {
    setUpAndStartRouting:function(app){
        app.get('/', require('../controllers/index_controller.js').index);
    }
};
