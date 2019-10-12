let express = require('express')
let router = express.Router()
let controller = require('./controller/controller')

let getRule = {
    config: 'getConfig',
    pathinfo: 'pathinfo',
    file: 'getFile',
}
let postRule = {
    config: 'setConfig',
    setBase: 'setBase',
}


for (let path in getRule) {
    router.get('/' + path, controller[getRule[path]])
}
for (let path in postRule) {
    router.post('/' + path, controller[postRule[path]])
}

module.exports = router