<template>
  <div>

    <mt-header :title="title">
      <div slot="left">
        <mt-button icon="back"></mt-button>
      </div>
      <mt-button icon="more" slot="right" @click="toMenu"></mt-button>
    </mt-header>

    <div class="path-bar">
        <span v-for="(path, index) in pathArr" :key="index">
            <a href="javascript:;">{{ path }}</a><span v-show="index !== pathArr.length - 1"> > </span>
        </span>
    </div>


    <mt-actionsheet :actions="menu" v-model="showMenu"></mt-actionsheet>

  </div>
</template>

<script>

export default {
    data() {
        return {
            title: '/',
            base: 'E:/muyu',
            path: '/a/b/c',
            dirIndex: 0,
            files: [
                {
                    name: 'image',
                    path: '/image',
                    type: 'dir',
                    children: [
                        {
                            name: 'image1.jpg',
                            path: '/image/image1.jpg',
                            type: 'file',
                        }, {
                            name: 'image1.jpg',
                            path: '/image/image2.jpg',
                            type: 'file',
                        }
                    ]
                }, {
                    name: 'vidro.mp4',
                    path: '/video.mp4',
                    type: 'file',
                }
            ],
            showMenu: false,
            menu: [
                {
                    name: '设置根目录',
                    method: () => {
                        let base = window.prompt('根目录', this.base)
                        if(base) {
                            this.base = base
                        }
                    }
                }
            ]
        }
    },
    methods: {
        toMenu() {
            this.showMenu = ! this.toShowMenu
        }
    },
    computed: {
        pathArr() {
            let arr = this.path.substr(1).split('/')
            arr.unshift('/')
            return arr
        },
        directories() {
            return this.files.filter(file => file.type === 'dir')
        },
        dirFiles() {
            
        }
    }
}
</script>

<style>
    .path-bar {
        margin: 3px 0 0 8px;
    }
    .child-item {
        height: 20px;
    }
</style>