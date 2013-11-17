/* Bootstraps the application and returns the config
 * @param express
 * @param app
 * @param path
 * @returns {{port: number, view_path: (*|string|join), public_path: (*|string|join), db_host: string, db_user: string, db_password: string, db_schema: string}}
 */

module.exports = function(express, app, path) {

    var config = {
        port:           8080,
        view_path:      path.join(__dirname + '/../', 'views'),
        public_path:    path.join(__dirname + '/../', 'public'),
        db_host:        '127.0.0.1',
        db_user:        'root',
        db_password:    '',
        db_schema:      'forgetless',
        pw_salt:        'L7WVS0YyWv2Y774M3glqbVp5Cioce2GI'
    };

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
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(config.public_path));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    return config;
};