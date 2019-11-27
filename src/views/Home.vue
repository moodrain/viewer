<template>
    <div>

        <mt-header :title="title">
            <mt-button icon="more" slot="right" @click="toMenu"></mt-button>
        </mt-header>

        <div class="path-bar">
            <span v-for="(path, index) in pathArr" :key="index">
                <a v-if="index != pathArr.length - 1" href="javascript:" @click="openPath(index)">{{ path }}</a><span v-show="index !== pathArr.length - 1"> > </span>
                <span v-if="index == pathArr.length - 1">{{ path }}</span>
            </span>
        </div>

        <hr style="margin: 2px;border-top: 0.1px solid lightgray;"/>

        <div class="dir-box">
            <mt-button class="dir-item" v-for="(dir, index) in directories" :key="index" size="small" :type="dirStyle[index] ? dirStyle[index] : 'default'" @click="openDir(index)">{{ dir.name }}</mt-button>
        </div>

        <div id="childBox" class="child-box">
            <div class="child-item" v-for="(child, index) in children" :key="index" @click="openChild(child, index)">
                <img v-lazy.childBox="child.imgSrc" v-if="child.kind == 'image'" :src="child.imgSrc" />
                <i v-if="child.kind != 'image'" :class="child.className"></i>
                <p>{{ child.name }}</p>
            </div>
        </div>

        <mt-actionsheet :actions="menu" v-model="showMenu"></mt-actionsheet>

    </div>
</template>

<script>
    import util from '../utils/util'
    export default {
        data() {
            return {
                title: '',
                base: '',
                path: '/',
                dirIndex: 0,
                files: [],
                showMenu: false,
                dirStyle: [],
                menu: [{
                        name: '设置根目录',
                        method: () => {
                            let base = window.prompt('根目录', this.base)
                            if(base) {
                                this.$http.post('setBase', {base}).then(() => {
                                    window.location = ''
                                    window.location.reload()
                                })
                            }
                        }
                }]
            }
        },
        created() {
            if(this.$route.query.path) {
                this.path = this.$route.query.path
            }
            if(this.$route.query.dir) {
                this.title = this.$route.query.dir
            }
            this.$http.get('config').then(rs => {
                this.base = rs.data.data.base
                this.$http.get('pathinfo?path=' + this.path).then(rs => {
                    this.files = rs.data.data
                    if(! this.title) {
                        this.title = this.pathArr[this.pathArr.length - 1]
                    }
                    if(this.$route.query.dir) {
                        this.directories.some((d, index) => {
                            if(d.name == this.$route.query.dir) {
                                this.dirIndex = index
                                this.dirStyle[index] = 'primary'
                                return true
                            }
                        })
                    }
                    if(this.dirStyle.length == 0) {
                        this.dirStyle[0] = 'primary'
                    }
                })
            })
        },
        methods: {
            toMenu() {
                this.showMenu = ! this.showMenu
            },
            openChild(child, index) {
                if(child.type == 'dir') {
                    this.path = child.path
                    this.dirIndex = 0
                    this.dirStyle = {[this.dirIndex]: 'primary'}
                    this.$router.push({
                        name: 'home',
                        query: {
                            path: child.path
                        }
                    })
                    this.$http.get('pathinfo?path=' + child.path).then(rs => {
                        this.files = rs.data.data
                        if(! this.title) {
                            this.title = this.pathArr[this.pathArr.length - 1]
                        }
                    })
                    return
                }
                if(child.kind == 'image') {
                    let {href} = this.$router.resolve({
                        name: 'gallery',
                        query: {
                            path: this.directory.path,
                            index
                        }
                    })
                    window.open(href, '_blank')
                    return;
                }
                if(child.kind == 'video') {
                    let {href} = this.$router.resolve({
                        name: 'player',
                        query: {path: child.path}
                    })
                    window.open(href, '_blank')
                    return;
                }
                window.open('api/file' + child.path + '?content_type=' + util.getMime(child.name), '_blank')
            },
            openPath(index) {
                let path = ''
                for(let i = 0;i <= index;i++) {
                    path += this.pathArr[i]
                    if(i != index && i != 0) {
                        path += '/'
                    }
                }
                this.$router.push({
                    name: 'home',
                    query: {path}
                })
                this.path = path
                this.dirIndex = 0
                this.dirStyle = {[this.dirIndex]: 'primary'}
                this.$http.get('pathinfo?path=' + path).then(rs => {
                    this.files = rs.data.data
                    if(! this.title) {
                        this.title = this.pathArr[this.pathArr.length - 1]
                    }
                })
            },
            openDir(index) {
                this.dirIndex = index
                this.dirStyle = {[this.dirIndex]: 'primary'}
                this.$router.push({
                    name: 'home',
                    query: {
                        path: this.path,
                        dir: this.directories[index].name,
                    }
                })
            }
        },
        computed: {
            pathArr() {
                let arr = this.path.substr(1).split('/')
                arr.unshift('/')
                return arr
            },
            rootFiles() {
                return this.files.filter(file => file.type != 'dir')
            },
            directories() {
                let directories = this.files.filter(file => file.type === 'dir')
                directories.unshift({
                    name: '/',
                    path: this.path,
                    type: 'dir',
                    children: this.rootFiles
                })
                return directories
            },
            directory() {
                return this.directories[this.dirIndex]
            },
            children() {
                let toChildren = []
                let children = this.directory ? this.directory.children : []
                toChildren = toChildren.concat(children.filter(child => child.type == 'dir'))
                toChildren = toChildren.concat(children.filter(child => child.type == 'file'))
                toChildren.forEach(child => {
                    if(child.kind == 'image') {
                        child.imgSrc = 'api/thumb/' + child.path + '?content_type=' + util.getMime(child.name)
                    } else {
                        if(child.type == 'dir') {
                            child.className = 'iconfont icon-folder'
                        } else {
                            switch(child.kind) {
                                case 'audio': child.className = 'iconfont icon-sound';break
                                case 'video': child.className = 'iconfont icon-video';break
                                default     : child.className = 'iconfont icon-file'
                            }
                        }
                    }
                })
                return toChildren
            }
        }
    }
</script>

<style scoped>
    .path-bar {
        margin: 3px 0 0 8px;
        font-size: 18px;
    }
    .child-box {
        display: flex;
        flex-wrap: wrap;
    }
    .child-item img {
        width: 170px;
        margin: 5px;
    }
    .child-item i {
        width: 170px;
        height: 170px;
        display: block;
        line-height: 170px;
        font-size: 45px;
        text-align: center;
    }
    .child-item p {
        width: 180px;
        text-align: center;
        overflow-x: hidden;
    }
    @media (max-width: 600px) {
        .child-item p {
            overflow-x: scroll;
        }
    }
    .dir-item {
        margin: 2px;
    }
    image[lazy=loading] {
        width: 170px;
        height: 170px;
        margin: auto;
    }
</style>