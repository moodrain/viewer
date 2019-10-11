let {rs, config, nfs} = require('../util/util')
let fs = require('fs')

module.exports = {
    index(req, res) {
        res.send('index')
    },
    test(req, res) {
        res.send(config('base'))
    },
    handle(req, res) {
        res.send(rs(req.body))
    },
    getConfig(req, res) {
        res.send(rs(config()))
    },
    setConfig(req, res) {
        for(key in req.body) {
            config(key, req.body[key])
        }
        res.send(rs())
    },
    pathinfo(req, res) {
        let path = config('base') + req.query.path
        let info = nfs.getDir(path)
        res.send(rs(info))
    },
    getFile(req, res) {
        res.set({'Content-Type': 'application/octet-stream'})
        let base = config('base')
        fs.createReadStream(base + '/' + req.query.file).pipe(res)
    },
    setBase(req, res) {
        let base = req.body.base
        if(base.endsWith('/')) {
            base = base.substr(0, base.length - 1)
        }
        config('base', base)
        res.send(rs())
    }
}