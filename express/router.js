let express = require('express')
let router = express.Router()
let controller = require('./controller/controller')

let getRule = {
    '': 'index',
    test: 'test',
}
let postRule = {
    handle: 'handle',
}
for (path in getRule) {
    router.get('/' + path, controller[getRule[path]])
}
for (path in postRule) {
    router.post('/' + path, controller[postRule[path]])
}

module.exports = router