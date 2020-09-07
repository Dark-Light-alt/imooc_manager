<template>
  <div class="previewCourse">
    <el-card class="header"
             :style="{backgroundImage:'linear-gradient(to right, rgba(0,0,0,.8), rgba(0,0,0,.4)),url(' + course.cover + ')'}"
             style="background-size:cover; color: white;">
      <h2>{{course.courseName}}</h2>
      <div class="header-main">
        <div class="photo">
          <el-avatar shape="square" :size="40"
                     src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
          </el-avatar>
        </div>
        <div class="personageInfo" v-if="course.employeeInfo != null">
          <span class="name">{{course.employeeInfo.employeeName}}</span>
          <span>{{course.employeeInfo.position.positionName}}</span>
        </div>
        <div class="courseInfo">
          <span>难度</span>
          <span v-if="course.courseLevel === 0">入门</span>
          <span v-else-if="course.courseLevel === 1">初级</span>
          <span v-else-if="course.courseLevel === 2">中级</span>
          <span v-else>高级</span>
          <span v-if="course.chapterList.length != 0">·</span>
          <span v-if="course.chapterList.length != 0">时长</span>
          <span v-if="course.chapterList.length != 0">{{showTotalTime(course.chapterList)}}</span>
        </div>
      </div>
    </el-card>
    <div class="main">
      <el-card>
        简介：{{course.courseAbout}}
      </el-card>
      <div v-if="course.chapterList.length != 0">
        <el-card v-for="chapter in course.chapterList" :key="chapter.chapterId">
          <h4>{{chapter.chapterName}}</h4>
          <p>{{chapter.chapterAbout}}</p>
          <div class="videoList" v-if="chapter.videoList.length !== 0">
            <a class="video" v-for="video in chapter.videoList" :key="video.videoId" @click="openVideo(video)">
              <i class="el-icon-video-play"></i>
              {{video.videoName}}
              {{showTime(video.duration)}}
              <span class="flag" v-if="video.videoIsenable == 1">已被禁用</span>
            </a>
          </div>
        </el-card>
      </div>
      <div v-if="course.datasList.length != 0">
        <el-card>
          <h4>课程资料</h4>
          <div class="datasList">
            <a class="datas" v-for="datas in course.datasList" :key="datas.dataId">
              <i class="el-icon-document"></i>
              {{datas.dataName}}
            </a>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PreviewCourse',
    data: function () {
      return {
        course: {},
        url: null,
      }
    },
    methods: {
      previewCourse: async function () {
        let courseId = JSON.parse(sessionStorage.getItem('course')).courseId
        const { data: res } = await this.$http.get(`CourseController/previewCourse/${courseId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.course = res.data.course
      },
      openVideo (video) {
        sessionStorage.setItem('video', JSON.stringify(video))
        this.$router.push({ name: 'VideoView' })
      },
      showTime (time) {
        if (time < 60) {
          return '00:' + time
        }
        let min = Math.floor(time / 60)
        let sec = Math.floor(time % 60)
        if (min < 60) {
          let m
          let s
          if (min < 10) {
            m = '0' + min
          } else {
            m = min
          }
          if (sec < 10) {
            s = '0' + sec
          } else {
            s = sec
          }
          return '(' + m + ':' + s + ')'
        }
      },
      showTotalTime (chapterList) {
        let totalSec = 0
        for (let i = 0; i < chapterList.length; i++) {
          let videoList = chapterList[i].videoList
          for (let j = 0; j < videoList.length; j++) {
            let video = videoList[j]
            totalSec = totalSec + video.duration
          }
        }

        if (totalSec < 60) {
          if (totalSec < 10) {
            return '00: 0' + totalSec
          }
          return '00: ' + totalSec
        }

        let totalMin = Math.floor(totalSec / 60)
        if (totalMin < 60) {
          return totalMin + '分'
        }
        if (totalMin == 60) {
          return '1小时'
        }
        let totalHour = Math.floor(totalMin / 60)
        let min = Math.floor(totalMin % 60)
        return totalHour + '小时' + min + '分'
      }
    },
    created: function () {
      this.previewCourse()
    }
  }
</script>

<style lang="less" scoped>
  .header {
    h2 {
      margin-top: 35px;
    }
  }

  .header-main {

    .photo {
      display: inline-block;
    }

    .personageInfo {
      margin-left: 5px;
      display: inline-block;
      height: 70px;

      .name {
        font-weight: bold;
      }

      span {
        display: block;
      }
    }

    .courseInfo {
      display: inline-block;
      height: 70px;
      line-height: 70px;
      padding-left: 15px;

      span {
        margin-left: 15px;
      }
    }
  }

  .main {
    padding-left: 100px;
    padding-right: 100px;
  }

  .videoList, .datasList {
    a {
      display: block;
      height: 50px;
      line-height: 50px;
      border-radius: 5px;
      padding-right: 10px;
      padding-left: 10px;

      .flag {
        float: right;
        background-color: rgb(242, 13, 13);
        color: white;
        margin-top: 10px;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 3px;
      }
    }

    a:hover {
      background: rgb(254, 243, 243);
      color: rgb(242, 13, 13);
    }
  }
</style>
