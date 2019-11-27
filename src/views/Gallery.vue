<template>
    <div>

        <mt-header :title="title"></mt-header>

        <div id="galleryBox" class="gallery-box">
            <img  v-lazy.galleryBox="image.imgSrc" @click="open" v-for="(image, index) in images" :src="image.imgSrc" v-show="index == imgIndex">
        </div>

        <div class="button-box">
            <mt-button @click="next(false)">Prev</mt-button>
            <mt-button @click="next(true)">Next</mt-button>
        </div>

    </div>
</template>

<script>
import util from "../utils/util"
export default {
    data() {
        return {
            path: '',
            files: [],
            imgIndex: 0,
        }
    },
    created() {
        this.path = this.$route.query.path
        if(this.$route.query.index) {
            this.imgIndex = Number.parseInt(this.$route.query.index)
        }
        let titleArr = this.path.split('/')
        this.title = titleArr[titleArr.length - 1]
        this.$http.get('pathinfo?path=' + this.path).then(rs => {
            this.files = rs.data.data
        })
    },
    methods: {
        next(next) {
            if(next && this.imgIndex < this.images.length - 1) {
                this.imgIndex++
            }
            if(! next && this.imgIndex > 0) {
                this.imgIndex--
            }
        },
        open() {
            window.open('api/file/' + this.image.path + '?content_type=' + util.getMime(this.image.name), '_blank')
        }
    },
    computed: {
        images() {
            let images = []
            this.files.forEach(file => {
                if(file.kind == 'image') {
                    let image = Object.assign({}, file)
                    image.imgSrc = 'api/thumb/' + image.path + '?content_type=' + util.getMime(image.name) + '&width=720'
                    images.push(image)
                }
            })
            return images
        },
        image() {
            return this.images[this.imgIndex] ? this.images[this.imgIndex] : null
        }
    }
}
</script>

<style scoped>
    .gallery-box {
        width: 100%;
    }
    .gallery-box img {
        width: 100%;
    }
    .button-box {
        width: 100%;
        text-align: center;
        position: fixed;
        bottom: 5px;
    }
    .button-box button {
        margin: 5px;
    }
</style>