const winston = require("winston");
const fs = require('fs');

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const level = process.env.LOG_LEVEL || 'debug';
var logger = new winston.Logger({
    //level: 'info',
    transports: [
      new (winston.transports.Console)({level:'debug',colorize: true}),
      new (winston.transports.File)({name:'error-file',filename:__dirname+'/../../logs/error.log',level:'error'}),
      new (winston.transports.File)({name:'info-file', filename: __dirname+'/../../logs/log.log',level:'debug' })
    ]
  });

module.exports = logger