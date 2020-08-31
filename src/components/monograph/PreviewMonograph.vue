<template>
  <div class="previewCourse">
    <el-card class="header"
             :style="{backgroundImage:'linear-gradient(to right, rgba(0,0,0,.8), rgba(0,0,0,.4)),url(' + monographInfo.cover + ')'}"
             style="background-size:cover; color: white;">
      <p class="header-oriented">
        <span>专刊</span>
      </p>
      <h2>{{monographInfo.monographName}}</h2>
      <div class="header-main">
        <div class="photo">
          <el-avatar shape="square" :size="40"
                     src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
          </el-avatar>
        </div>
        <div class="personageInfo" v-if="monographInfo.employeeInfo != null">
          <span class="name">{{monographInfo.employeeInfo.employeeName}}</span>
          <span>{{monographInfo.employeeInfo.position.positionName}}</span>
        </div>
      </div>
    </el-card>
    <div class="main">
      <el-card>
        简介：{{monographInfo.monographAbout}}
      </el-card>
      <div>
        <el-card v-for="chapter in monographInfo.chapterList" :key="chapter.chapterId">
          <h4>{{chapter.chapterName}}</h4>
          <p>{{chapter.chapterAbout}}</p>
          <div class="videoList">
            <a class="video" v-for="article in chapter.articleList" :key="article.articleId" @click="openArticle(article.articleId)">
              <i class="el-icon-document"></i>
              {{article.articleName}}
              <el-tag type="warning" v-if="article.tryReading==1" size="mini">试读文章</el-tag>
            </a>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog title="预览" :visible.sync="showVisible" width="60%" :close-on-click-modal="false">
      <v-md-editor :value="fileContent" mode="preview"></v-md-editor>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'PreviewMonograph',
    data: function () {
      return {
        monographInfo: {},
        url: null,
        fileContent:'',
        showVisible: false
      }
    },
    methods: {
      findAll: async function () {
        let monographId = JSON.parse(sessionStorage.getItem('monograph')).monographId;
        const { data: res } = await this.$http.post('MonographController/previewMonograph',{monographId:monographId})
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.monographInfo = res.data.monograph
      },openArticle: async function(articleId){
        const { data: res } = await this.$http.get(`ArticleController/readFile/${articleId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.fileContent = res.data.fileContent
        this.showVisible=true;
      }
    },
    created: function () {
      this.findAll()
    }
  }
</script>

<style lang="less" scoped>
  .header {
    .header-oriented {
      color: rgb(133, 133, 131);

      span {
        padding-right: 5px;
      }
    }

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
    }

    a:hover {
      background: rgb(254, 243, 243);
      color: rgb(242, 13, 13);
    }
  }
</style>
