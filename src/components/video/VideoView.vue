<template>
  <div class="videoView">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'PreviewCourse' }">课程预览</el-breadcrumb-item>
      <el-breadcrumb-item>{{video.videoName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <video class="video" :src="video.videoUrl" controls="controls"></video>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'VideoView',
    data: function () {
      return {
        video: null
      }
    },
    methods: {
      videoView: function () {
        this.video = JSON.parse(sessionStorage.getItem('video'))
      }
    },
    created: function () {
      this.videoView()
    }
  }
</script>

<style scoped>
  .video {
    width: 100%;
    height: 600px;
  }
</style>
