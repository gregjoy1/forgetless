module.exports = {
    setUpAndStartRouting:function(app){

        require('./page_router')(app);

        require('./ajax_router')(app);

    }
};
