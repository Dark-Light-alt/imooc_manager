<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'MyMonograph' }">构建课程</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'MonogrphChapterManage' }">目录管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Article' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form label-position="right" label-width="100px" :model="updateArticleInfo">
        <el-form-item label="标题" prop="articleName">
          <el-input v-model="updateArticleInfo.articleName"></el-input>
        </el-form-item>
        <el-form-item>
          <v-md-editor v-model="articleContent" height="500px"></v-md-editor>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="updateArticle">完成</el-button>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'UpdateArticle',
    data: function () {
      return {
        updateArticleInfo: {
          articleId: '',
          articleName: '',
          articleUrl: '',
          tryReading: null,
          chapterId: ''
        },
        articleContent: ''
      }
    },
    methods: {
      updateArticle: async function () {
        const { data: res } = await this.$http.post('ArticleController/updateArticle', {
          article: this.updateArticleInfo,
          articleContent: this.articleContent
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        //添加成功返回Article页面
        this.$router.push({ name: 'Article' })
      }
    },
    created: function () {
      this.updateArticleInfo = Object.assign(this.updateArticleInfo, JSON.parse(sessionStorage.getItem('article')))
      this.articleContent = this.$route.query.fileContent
    }
  }
</script>

<style scoped>

</style>
