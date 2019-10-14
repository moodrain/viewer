let fs = require('fs')

let rs = (data = null, msg = '', code = 0) => {
    return JSON.stringify({code, msg, data})
}

let config = (key, val) => {
    let file = __dirname + '/../config.json'
    if(! key && ! val) {
        return JSON.parse(fs.readFileSync(file))
    }
    if(key && ! val) {
        return JSON.parse(fs.readFileSync(file))[key]
    }
    if(key && val) {
        let oldConfig = config()
        oldConfig[key] = val
        fs.writeFileSync(file, JSON.stringify(oldConfig))
    }
}

let getKind = file => {
    let extArr = file.split('.')
    let ext = extArr[extArr.length - 1].toLowerCase()
    switch(ext) {
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'webp':
        case 'bmp':
        case 'png': return 'image'
        case 'mp4':
        case 'flv':
        case 'mkv':
        case 'mov':
        case 'avi':
        case '3gp':
        case 'rmvb': return 'video'
        case 'mp3':
        case 'wav':
        case 'flac': return 'voice'
        default: return 'other'
    }
}

let nfs = {
    getDir(path) {
        let base = config('base')
        if(path.endsWith('/')) {
            path = path.substr(0, path.length - 1)
        }
        let toReturn  = []
        try {
            if(! fs.existsSync(path) || ! fs.statSync(path).isDirectory()) {
                return []
            }
        } catch (e) {
            return []
        }
        let items = []
        if(path.endsWith(':')) {
            items = fs.readdirSync(path + '/')
        } else {
            items = fs.readdirSync(path)
        }
        items.forEach(item => {
            let toItem = {}
            let itemPath = path + '/' + item
            toItem.name = item
            toItem.path = itemPath
            try {
                toItem.type = fs.statSync(itemPath).isDirectory() ? 'dir' : 'file'
            } catch (e) {}
            toItem.kind = toItem.type == 'dir' ? 'directory' : getKind(toItem.name)
            if(toItem.type == 'dir') {
                let children = fs.readdirSync(itemPath)
                let toChildren = []
                children.forEach(child => {
                    let toChild = {}
                    let childPath = itemPath + '/' + child
                    toChild.name = child
                    toChild.path = childPath
                    toChild.type = fs.statSync(childPath).isDirectory() ? 'dir' : 'file'
                    toChild.kind = toChild.type == 'dir' ? 'directory' : getKind(toChild.name)
                    toChild.path = toChild.path.replace(base, '')
                    toChildren.push(toChild)
                })
                toItem.children = toChildren
            }
            toItem.path = toItem.path.replace(base, '')
            toReturn.push(toItem)
        })
        return toReturn
    }
}

module.exports = {
    rs, config, nfs
}