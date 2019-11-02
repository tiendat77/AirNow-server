const mongoose = require('mongoose');

const statisSchema = new mongoose.Schema({
  title: String,
  value: Number
});

const Statis = mongoose.model('Statistic', statisSchema);

module.exports = Statis;