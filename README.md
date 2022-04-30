# express-logger

Simple wrapper for [morgan](https://github.com/expressjs/morgan) package with some predefined settings.

## Features

- Used predefined format settings to split request log into start and end section.
- Used local 24-h datetime format instead of ISO.
- Cuts off GET params from requested url (only for the start section) and shows them as object.
- Shows preview of the `Content-type` header value and `req.body` content for the rest of methods.

## Installation

`npm i github:Pashted/express-logger#master`

## Usage

Use it as middleware for Express app instance.

```javascript
const express = require('express');
const app = express();
const logger = require('express-logger');

/** Second parameter enables set of `util` options to simplify req.body preview */
logger(app, true);

/** Or define custom options for `util` module.
 * Next numbers are used in case of `true` option passed. */
logger(app, {
    depth:          1,
    maxArrayLength: 10,
    breakLength:    80,
});
```

## Example

```

[2022-04-30 15:50:51.726] 192.168.1.2 - MyUsername "GET /api/v1/example-method HTTP/1.1" "https://www.amazon.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36" 
{ market: 'amazon', _id: '123456789' }
[2022-04-30 15:50:51.758] GET /api/v1/example-method?market=amazon&_id=123456789 200 9845 - 31.921 ms
 
 
[2022-04-30 15:50:56.508] 192.168.1.2 - MyUsername "POST /api/v1/example-method HTTP/1.1" "https://www.amazon.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36" 
application/json {
  _id: '123456789',
  sensitive_data_from_body: [
    [Object], [Object],
    [Object], [Object],
    [Object], [Object],
    [Object], [Object],
    [Object], [Object],
    ... 15 more items
  ]
} 
[2022-04-30 15:50:56.544] POST /api/v1/example-method 200 133 - 33.099 ms

```
