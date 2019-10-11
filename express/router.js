let express = require('express')
let router = express.Router()
let controller = require('./controller/controller')

let getRule = {
    '': 'index',
    test: 'test',
    config: 'getConfig',
    pathinfo: 'pathinfo',
}
let postRule = {
    handle: 'handle',
    config: 'setConfig',
}


for (path in getRule) {
    router.get('/' + path, controller[getRule[path]])
}
for (path in postRule) {
    router.post('/' + path, controller[postRule[path]])
}

module.exports = router