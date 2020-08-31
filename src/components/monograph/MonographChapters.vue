<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'MyMonograph' }">专栏管理</el-breadcrumb-item>
      <el-breadcrumb-item>专栏目录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="clearfix">
        <h3>{{monograph.monographName}}</h3>
        简介:{{monograph.monographAbout}}
      </div>
    </el-card>
    <div v-for="(c,index) in chapterList" :key="index" class="text item">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>第{{index+1}}章 {{c.chapterName}}</h3>
          {{c.chapterAbout}}
        </div>
        <div v-for="(a,i) in c.articleList" :key="i" class="text item">
          {{a.articleName}}
        </div>
      </el-card>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'MonographChapters',
    data: function(){
      return {
        chapterList: [],
        monograph: {}
      }
    },
    methods: {
      findAll: async function () {
        this.monograph = Object.assign(this.monograph, JSON.parse(sessionStorage.getItem('monograph')))

        const { data: res } = await this.$http.get(`ChapterController/findACByMid/${this.monograph.monographId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.chapterList = res.data.chapterList
      },
    },created: function () {
      this.findAll();
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>
