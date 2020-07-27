const path = require('path')

//  Gives the path to the entry point file
module.exports = path.dirname(process.mainModule.filename)
