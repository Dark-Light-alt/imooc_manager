<template>
  <div class="courseChapterManage">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'MyMonograph' }">构建专刊</el-breadcrumb-item>
      <el-breadcrumb-item>目录管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3>{{this.monograph.monographName}}</h3>
      <p>{{this.monograph.monographAbout}}</p>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="章节名称" v-model="pages.searchs.chapterName" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">新建章节</el-button>
        </el-col>
      </el-row>
      <el-table :data="chapterList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left">
              <el-form-item label="章节简介">
                <span>{{ scope.row.chapterAbout }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ scope.row.createTime}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="chapterName" label="章节名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="文章管理" placement="top-start" :enterable="false">
              <el-button size="mini" icon="el-icon-document" type="primary" @click="articleManage(scope.row)"></el-button>
            </el-tooltip>
            <el-button size="mini" icon="el-icon-edit" type="primary"
                       @click="showUpdateDialog(scope.row.chapterId)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger"
                       @click="deleteChapter(scope.row.chapterId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="新建章节" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendForm')" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" :model="appendChapterInfo" ref="appendForm">
        <el-form-item label="章节标题" prop="chapterName" :show-overflow-tooltip="true">
          <el-input v-model="appendChapterInfo.chapterName"></el-input>
        </el-form-item>
        <el-form-item label="章节简介" prop="chapterAbout">
          <el-input type="textarea" v-model="appendChapterInfo.chapterAbout"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendChapter">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改章节" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updateForm')" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" :model="updateChapterInfo" ref="updateForm">
        <el-form-item label="章节标题" prop="chapterName">
          <el-input v-model="updateChapterInfo.chapterName"></el-input>
        </el-form-item>
        <el-form-item label="章节简介" prop="chapterAbout">
          <el-input type="textarea" v-model="updateChapterInfo.chapterAbout"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateChapter">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'MonogrphChapterManage',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            chapterName: ''
          },
          flag: true
        },
        monograph:{
          monographId:'',
          monographName:'',
          monographAbout:''
        },
        chapterList: [],
        appendDialogVisible: false,
        appendChapterInfo: {
          chapterId: null,
          chapterName: null,
          chapterAbout: null,
          chapterType: 0,
          chapterResource: null,
        },
        updateDialogVisible: false,
        updateChapterInfo: {
          chapterId: null,
          chapterName: null,
          chapterAbout: null,
          chapterType: 0,
          chapterResource: null,
        },
        course: {}
      }
    },
    methods: {
      findAll: async function () {

        this.monograph = Object.assign(this.monograph, JSON.parse(sessionStorage.getItem('monograph')))

        const { data: res } = await this.$http.post('ChapterController/findChapter', {
          pages: this.pages,
          chapterResource: this.monograph.monographId
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.chapterList = res.data.chapterList
        this.pages = res.pages
      },
      appendChapter: async function () {
        this.appendChapterInfo.chapterResource=this.monograph.monographId;
        const { data: res } = await this.$http.put('ChapterController/append', this.appendChapterInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.findAll()
        this.appendDialogVisible = false
      },
      showUpdateDialog: async function (chapterId) {
        const { data: res } = await this.$http.get(`ChapterController/findById/${chapterId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateChapterInfo = res.data.chapter
        this.updateDialogVisible = true
      },
      updateChapter: async function () {
        const { data: res } = await this.$http.put('ChapterController/update', this.updateChapterInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.findAll()
        this.updateDialogVisible = false
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
      articleManage:  function (row) {
        sessionStorage.setItem('chapter', JSON.stringify(row))
        this.$router.push({ name: 'Article'})
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
      },
      dialogClose: function (formRef) {
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.findAll();
    }
  }
</script>

<style scoped>

</style>
