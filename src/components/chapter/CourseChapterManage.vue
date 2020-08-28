<template>
  <div class="courseChapterManage">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'CourseBuild' }">构建课程</el-breadcrumb-item>
      <el-breadcrumb-item>章节管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3>{{course.courseName}}</h3>
      <p>{{course.courseAbout}}</p>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="章节名称" v-model="pages.searchs.chapterName" clearable @clear="findCourseChapter">
            <el-button slot="append" icon="el-icon-search" @click="findCourseChapter"></el-button>
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
            <el-tooltip class="item" effect="dark" content="视频管理" placement="top-start" :enterable="false">
              <el-button size="mini" icon="el-icon-video-play" type="primary"
                         @click="showVideo(scope.row)"></el-button>
            </el-tooltip>
            <el-button size="mini" icon="el-icon-edit" type="primary"
                       @click="showUpdateDialog(scope.row.chapterId)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger"
                       @click="removeChapterAndVideo(scope.row.chapterId)"></el-button>
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
               @close="dialogClose('appendChapterForm')">
      <el-form label-position="right" label-width="100px" :model="appendChapterInfo" ref="appendChapterForm">
        <el-form-item label="章节标题" prop="chapterName">
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
               @close="dialogClose('updateChapterForm')">
      <el-form label-position="right" label-width="100px" :model="updateChapterInfo" ref="updateChapterForm">
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
    name: 'CourseChapterManage',
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
      findCourseChapter: async function () {

        this.course = Object.assign(this.course, JSON.parse(sessionStorage.getItem('course')))

        const { data: res } = await this.$http.post('ChapterController/findChapter', {
          pages: this.pages,
          chapterResource: this.course.courseId
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.chapterList = res.data.chapterList
        this.pages = res.pages
      },
      appendChapter: async function () {
        this.appendChapterInfo.chapterResource = JSON.parse(sessionStorage.getItem('course')).courseId

        const { data: res } = await this.$http.put('ChapterController/append', this.appendChapterInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.findCourseChapter()
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
        this.findCourseChapter()
        this.updateDialogVisible = false
      },
      removeChapterAndVideo: async function (chapterId) {
        const result = await this.$confirm('是否删除此章节及对应的所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.delete(`ChapterController/removeChapterAndVideo/${chapterId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.findCourseChapter()
      },
      showVideo: function (row) {
        sessionStorage.setItem('chapter', JSON.stringify(row))
        this.$router.push({ name: 'Video' })
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.findCourseChapter()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.findCourseChapter()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.findCourseChapter()
      },
      dialogClose: function (formRef) {
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.findCourseChapter()
    }
  }
</script>

<style scoped>

</style>
