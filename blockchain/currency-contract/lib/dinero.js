const CONFIG = require('../config.json')
const Dinero = require('dinero.js')

Dinero.defaultCurrency = CONFIG.defaultCurrency
Dinero.defaultPrecision = CONFIG.defaultPrecision
Dinero.globalFormat= CONFIG.globalFormat

module.exports = Dinero