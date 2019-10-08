const express = require('express');
const helmet = require("helmet");

const server = express();

const accountRouter = require('./data/routers/accountRouter.js');

function logger(req, res, next) {
    console.log(`a ${req.method} request was sent to ${req.path} at ${Date.now()}`);
    next();
}

server.use(express.json());
server.use(helmet());
server.use(logger);
server.use('/api/accounts', accountRouter);

module.exports = server;
