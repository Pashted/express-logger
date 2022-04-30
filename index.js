const util = require('util');
const logger = require('morgan');
const dateFormat = require('dateformat');
const isDevMode = process.env.NODE_ENV === 'development';

/**
 * @param {object} app Express app instance
 * @param {boolean|object} utilOptions Set `true` to use predefined `util` options.
 * Or put here object with your own `util` options.
 */
module.exports = (app, utilOptions) => {
    let options = {};

    if (utilOptions === true) {
        options = {
            depth:          1,
            maxArrayLength: 10,
            breakLength:    80,
        };
    } else if (utilOptions === 'object') {
        options = utilOptions;
    }

    logger.token('datetime', () => dateFormat('yyyy-mm-dd HH:MM:ss.l'));
    logger.token('baseUrl', req => req._parsedUrl?.pathname || req.baseUrl || req.originalUrl || req.url);
    logger.token('data', req =>
        req.method === 'GET'
        ? (Object.keys(req.query).length ? `\n${util.inspect(req.query, options)}` : '')
        : `\n${req.headers['content-type']} ${util.inspect(req.body, options)}`
    );

    logger.format('customCombined', ' \n[:datetime] :remote-addr - :remote-user ":method :baseUrl HTTP/:http-version" ":referrer" ":user-agent" :data');
    logger.format('customTiny', '[:datetime] :method :url :status :res[content-length] - :response-time ms\n ');


    // at request start
    app.use(logger('customCombined', { immediate: true }));
    // at request end
    app.use(logger(isDevMode ? 'dev' : 'customTiny'));
};
