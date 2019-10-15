let {rs, config, nfs} = require('../util/util')
let fs = require('fs')
const sharp = require('sharp')

let base = config('base')

module.exports = {
    getConfig(req, res) {
        res.send(rs(config()))
    },
    setConfig(req, res) {
        for(let key in req.body) {
            config(key, req.body[key])
        }
        res.send(rs())
    },
    pathinfo(req, res) {
        let path = base + req.query.path
        let info = nfs.getDir(path)
        res.send(rs(info))
    },
    getFile(req, res) {
        let contentType = req.query.content_type ? req.query.content_type : 'application/octet-stream'
        res.set({'Content-Type': contentType})
        fs.createReadStream(base + '/' + req.params[0]).pipe(res)
    },
    getThumb(req, res) {
        let contentType = req.query.content_type ? req.query.content_type : 'application/octet-stream'
        res.set({'Content-Type': contentType})
        let width = req.query.width ? Number.parseInt(req.query.width) : 170
        sharp(base + '/' + req.params[0]).resize(width).pipe(res)
    },
    getVideo(req, res) {
        let file = base + '/' + req.params[0]
        let size = fs.statSync(file).size
        let contentType = req.query.content_type ? req.query.content_type : 'application/octet-stream'
        let start = Number.parseInt(req.header('Range').split('=')[1].split('-')[0])
        let length = 2 * 1024 * 1024
        let contentLength = length
        if(start + length > size) {
            contentLength = size - start
        }
        res.set({
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Range': `bytes ${start}-${start + contentLength - 1}/${size}`,
        })
        res.status(206)
        fs.createReadStream(file, {
            start: start,
            end: start + contentLength - 1,
        }).pipe(res)
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