module.exports = {
    index(req, res) {
        res.send('index')
    },
    test(req, res) {
        res.send('test')
    },
    handle(req, res) {
        res.send(JSON.stringify(req.body))
    }
}