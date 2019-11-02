const winston = require('winston');
const path = require('path');

const file = new winston.transports.File({
  filename: path.join(__dirname, 'log.log')
});

const consoles = new winston.transports.Console();

const logger = new winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  level: 'info',
  transports: [
    file,
    consoles
  ]
});

module.exports = logger;