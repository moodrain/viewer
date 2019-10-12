<template>
    <div>

        <mt-header :title="title">
            <mt-button icon="more" slot="right" @click="toMenu"></mt-button>
        </mt-header>

        <div class="path-bar">
            <span v-for="(path, index) in pathArr" :key="index">
                <a href="javascript:" @click="openPath(index)">{{ path }}</a><span v-show="index !== pathArr.length - 1"> > </span>
            </span>
        </div>

        <hr style="margin: 2px;border-top: 0.1px solid lightgray;"/>

        <div class="dir-box">
            <mt-button class="dir-item" v-for="(dir, index) in directories" :key="index" size="small" :type="index == dirIndex ? 'primary' : 'default'" @click="dirIndex = index">{{ dir.name }}</mt-button>
        </div>

        <div class="child-box">
            <div class="child-item" v-for="(child, index) in children" :key="index" @click="openChild(child)">
                <img v-if="child.kind == 'image'" :src="child.imgSrc" />
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
                title: '/',
                base: '',
                path: '/',
                dirIndex: 0,
                files: [],
                showMenu: false,
                menu: [{
                        name: '设置根目录',
                        method: () => {
                            let base = window.prompt('根目录', this.base)
                            if(base) {
                                this.$http.post('setBase', {base}).then(() => { window.location = '/' })
                            }
                        }
                }]
            }
        },
        created() {
            if(this.$route.query.path) {
                this.path = this.$route.query.path
            }
            this.$http.get('config').then(rs => {
                this.base = rs.data.data.base
                this.$http.get('pathinfo?path=' + this.path).then(rs => {
                    this.files = rs.data.data
                    this.title = this.pathArr[this.pathArr.length - 1]
                })
            })
        },
        methods: {
            toMenu() {
                this.showMenu = ! this.showMenu
            },
            openChild(child) {
                if(child.type == 'dir') {
                    window.location = '?path=' + child.path
                    return
                }
                window.open('api/file?file=' + child.path + '&content_type=' + util.getMime(child.name), '_blank')
            },
            openPath(index) {
                let path = ''
                for(let i = 0;i <= index;i++) {
                    path += this.pathArr[i]
                    if(i != index && i != 0) {
                        path += '/'
                    }
                }
                window.location = '?path=' + path
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
                        child.imgSrc = 'api/file?file=' + child.path + '&content_type=' + util.getMime(child.name)
                    } else {
                        if(child.type == 'dir') {
                            child.className = 'iconfont icon-folder'
                        } else {
                            switch(child.kind) {
                                case 'audio': child.className = 'iconfont icon-sound';break
                                case 'video': child.className = 'iconfont icon-video';break
                            }
                        }
                    }
                })
                return toChildren
            }
        }
    }
</script>

<style>
    .path-bar {
        margin: 3px 0 0 8px;
        font-size: 18px;
    }
    .child-box {
        display: flex;
        flex-wrap: wrap;
    }
    .child-item img {
        width: 180px;
    }
    .child-item i {
        width: 180px;
        height: 180px;
        display: block;
        line-height: 180px;
        font-size: 45px;
        text-align: center;
    }
    .child-item p {
        width: 180px;
        text-align: center;
        overflow-x: scroll;
    }
    .dir-item {
        margin: 2px;
    }
</style>