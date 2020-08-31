<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'MyMonograph' }">构建课程</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'MonogrphChapterManage' }">目录管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3>{{chapter.chapterName}}</h3>
      <p>{{chapter.chapterAbout}}</p>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="文章名称" v-model="pages.searchs.articleName" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="success" icon="el-icon-edit-outline" @click="writeArticle">写文章</el-button>
        </el-col>
      </el-row>
      <el-table :data="articleList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="articleName" label="文章标题"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-tag size="mini" type="warning" v-if="scope.row.tryReading === 1">试读文章</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="updateArticle(scope.row.articleId)"></el-button>
            <el-tooltip class="item" effect="dark" content="文章预览" placement="top-start" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-view"
                         @click="showArticle(scope.row.articleId)"></el-button>
            </el-tooltip>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="remove(scope.row.articleId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="预览" :visible.sync="showVisible" width="60%">
      <v-md-editor :value="fileContent" mode="preview"></v-md-editor>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Article',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            articleName: ''
          },
          flag: true
        },
        chapter: {},
        articleList: [],
        str: '',
        fileContent:'',
        showVisible:false
      }
    },
    methods: {
      findAll: async function () {
        //根据章节查询文章
        this.chapter =Object.assign(this.chapter, JSON.parse(sessionStorage.getItem('chapter')))
        const { data: res } = await this.$http.post('ArticleController/findAll', {
          pages: this.pages,
          chapterId: this.chapter.chapterId
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.articleList = res.data.articleList
        this.pages = res.pages
      },
      remove: async function (articleId) {
        const result = await this.$confirm('是否删除此文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (result !== 'confirm') {
          return
        }
        const { data: res } = await this.$http.delete(`ArticleController/deleteArticle/${articleId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
      },
      writeArticle: async function () {
        //写文章
        this.$router.push({name:"WriteArticle",params:{str:'',chapterId:this.chapter.chapterId}});
      },
      updateArticle: async function (articleId) {
        //访问后台读取文件
        const { data: res } = await this.$http.get(`ArticleController/readFile/${articleId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        //将文章对象保存在sessionStorage中
        sessionStorage.setItem("article",JSON.stringify(res.data.article))
        //跳页面修改文章
        this.$router.push({name:"UpdateArticle",params:{fileContent:res.data.fileContent}});
      },
      showArticle: async function (articleId) {
        //访问后台读取文件
        const { data: res } = await this.$http.get(`ArticleController/readFile/${articleId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.fileContent=res.data.fileContent;
        this.showVisible=true;
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.findAll()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAll()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAll()
      }
    },
    created: function () {
      this.findAll()
    }
  }
</script>

<style scoped>

</style>
