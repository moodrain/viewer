<template>
    <div>
        <div>
            <mt-header :title="title"></mt-header>
        </div>

        <div id="dplayer-container"></div>
    </div>
</template>

<script>
import util from "../utils/util"
import DPlayer from 'dplayer'

export default {
    data() {
        return {
            path: '',
        }
    },
    created() {
        this.path = this.$route.query.path
        let titleArr = this.path.split('/')
        this.title = titleArr[titleArr.length - 1]
    },
    mounted() {
        const dp = new DPlayer({
            container: document.getElementById('dplayer-container'),
            video: {
                url: 'api/video/' + this.path + '?content_type=' + util.getMime(this.path),
                autoplay: true,
            },
        })
    },
    methods: {

    }
}
</script>

<style scoped>

</style>