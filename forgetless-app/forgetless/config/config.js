module.exports = function(express, app, path) {

    var config = {
        port:           8080,
        view_path:      path.join(__dirname, '/../', 'views'),
        public_path:    path.join(__dirname, '/../', 'public'),
        log_path:       path.join(__dirname, '/../', 'logs'),
        db_host:        '127.0.0.1',
        db_user:        'root',
        db_password:    '',
        db_schema:      'forgetless',
        pw_salt:        'L7WVS0YyWv2Y774M3glqbVp5Cioce2GI',
        token_salt:     '12fsWw1k9so56O4uZ5zu3TRiFs9rnh3f'
    };

    if(app && express) {
        // all environments
        app.set('port', 8080);

        app.set('views', config.view_path);
        app.set('view engine', 'ejs');

        app.engine('html', require('ejs').renderFile);

        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser('131xkGXI8argN47t0m3A1b7VT6Y9Lgiw'));
        app.use(express.session());
        app.use(app.router);
        app.use(express.static(config.public_path));

        // development only
        if ('development' == app.get('env')) {
            app.use(express.errorHandler());
        }
    }

    return config;
};