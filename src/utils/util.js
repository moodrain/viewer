let getMime = file => {
    let extArr = file.split('.')
    let ext = extArr[extArr.length - 1].toLowerCase()
    switch(ext) {
        case 'jpg': return 'image/jpeg'
        case 'jpeg': return 'image/jpeg'
        case 'gif': return 'image/gif'
        case 'webp': return 'image/webp'
        case 'bmp': return 'image/x-ms-bmp'
        case 'png': return 'image/png'
        case 'mp4': return 'video/mp4'
        case 'flv': return 'video/x-flv'
        case 'mkv': return 'video/x-matroska'
        case 'mov': return 'video/quicktime'
        case 'avi': return 'video/x-msvideo'
        case '3gp': return 'video/3gpp'
        case 'rmvb': return 'video/vnd.rn-realvideo'
        case 'mpg': return 'video/mpeg'
        case 'mpeg': return 'video/mpeg'
        case 'mpe': return 'video/mpeg'
        case 'mp3': return 'audio/mpeg'
        case 'wav': return 'audio/x-wav'
        case 'flac': return 'audio/x-flac'
        default: return 'application/octet-stream'
    }
}

export default {
    getMime
}