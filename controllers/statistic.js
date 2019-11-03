const Statistic = require('../models/Statistic');
const logger = require('../log/logger');

// Show all statistic value
const getAll = (req, res) => {
  Statistic
    .find({})
    .then(result => {
      res.json({ statistics: result });
    })
    .catch(error => {
      logger.error(error);
    })
}

/**
 * Increment value every time sever have requested
 * visit:     when home page is serve
 * download:  when having request data
 * upload:    when receiving data from device
 * device:    number of devices
 */
const visit = () => {
  Statistic
    .updateOne({ title: 'visit' }, {$inc: { value: 1 }})
    .then(result => {
      logger.info('visited');
    })
    .catch(error => {
      logger.error(error);
    })
}

const download = () => {
  Statistic
    .updateOne({ title: 'download' }, {$inc: { value: 1 }})
    .then(result => {
      logger.info('download requested');
    })
    .catch(error => {
      logger.error(error);
    })
}

const upload = () => {
  Statistic
    .updateOne({ title: 'upload' }, {$inc: { value: 1 }})
    .then(result => {
      logger.info('uploaded from esp');
    })
    .catch(error => {
      logger.error(error);
    })
}

const device = () => {
  Statistic
    .updateOne({ title: 'device added' }, {$inc: { value: 1 }})
    .then(result => {
      logger.info('Device' + result);
    })
    .catch(error => {
      logger.error(error);
    })
}

module.exports = {
  getAll,
  visit,
  download,
  upload,
  device
}