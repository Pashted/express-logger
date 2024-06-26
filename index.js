const util = require('node:util');
const logger = require('morgan');
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
    } else if (typeof utilOptions === 'object') {
        options = utilOptions;
    }

    // yyyy-MM-dd HH:mm:ss.SSS
    logger.token('datetime', () => {
        let dt = new Date();
        return `${dt.toLocaleString('sv')}.${dt.toLocaleString('sv', {fractionalSecondDigits: 3})}`;
    });
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
