<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>专栏目录</el-breadcrumb-item>
    </el-breadcrumb>
    专刊
    {{this.monograph.monographId}}
    ------------------------
    章节
    <div v-for="(c,index) in chapterList" :key="index">
      {{c}}-----------
      <el-button size="mini" type="primary" @click="deleteChapter(c.chapterId)">删除章节</el-button>
    </div>


     <el-button size="mini" type="primary" @click="appendChapterDialogVisible = true">添加章节
     </el-button>

     <el-dialog title="添加章节" :visible.sync="appendChapterDialogVisible" width="50%" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" :model="appendChapterInfo">
        <input v-model="appendChapterInfo.chapterResource" type="hidden"/>
        <el-form-item label="章节标题" prop="chapterName">
          <el-input v-model="appendChapterInfo.chapterName"></el-input>
        </el-form-item>
        <el-form-item label="章节简介" prop="chapterAbout">
          <el-input v-model="appendChapterInfo.chapterAbout"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendChapterDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendChapter()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'DireMent',
    data: function(){
      return {
        chapterList: [],
        monograph:{},
        appendChapterDialogVisible: false,
        appendChapterInfo: {
        chapterName: null,
        chapterAbout: null,
        chapterType: 1,
        chapterResource: null
      }
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.get(`ChapterController/findACByMid/${this.monograph.monographId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.chapterList = res.data.chapterList
      },
     appendChapter: async function () {
       this.appendChapterInfo.chapterResource=this.monograph.monographId;
       const { data: res } = await this.$http.put('ChapterController/append', this.appendChapterInfo)
       if (!res.meta.access) {
         return this.$message.error(res.meta.msg)
       }

       this.appendChapterDialogVisible = false
       this.findAll()
       this.$message.success(res.meta.msg)
     },
      deleteChapter: async function (chapterId) {
        const result = await this.$confirm('删除章节将会删除章节下的所有的文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.get(`ChapterController/deleteChatsAndArts/${chapterId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
      },
    },created: function () {
      this.monograph = this.$route.params.monograph;
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
