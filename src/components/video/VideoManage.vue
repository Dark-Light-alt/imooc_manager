<template>
  <div class="video">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'CourseBuild' }">构建课程</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'CourseChapterManage' }">章节管理</el-breadcrumb-item>
      <el-breadcrumb-item>视频管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3>{{chapter.chapterName}}</h3>
      <p>{{chapter.chapterAbout}}</p>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="视频名称" v-model="pages.searchs.videoName" clearable @clear="findChapterVideo">
            <el-button slot="append" icon="el-icon-search" @click="findChapterVideo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button icon="el-icon-upload" type="success" @click="appendDialogVisible = true">上传视频</el-button>
        </el-col>
      </el-row>
      <el-table :data="videoList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="videoName" label="课程名"></el-table-column>
        <el-table-column prop="tryAndSee" label="是否试看">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.tryAndSee === 0" type="info">是</el-tag>
            <el-tag v-if="scope.row.tryAndSee === 1" type="success">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="videoUrl" label="视频">
          <template slot-scope="scope">
            <video style="width: 200px;"
                   v-if="scope.row.videoUrl !='' && scope.row.videoUrl != null" :src="scope.row.videoUrl"
                   controls="controls">
            </video>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary"
                       @click="showUpdateDialog(scope.row.videoId)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="remove(scope.row.videoId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="上传课程视频" :visible.sync="appendDialogVisible" width="60%"
               @close="dialogClose('appendVideoForm')">
      <el-form label-position="right" label-width="100px" :model="appendVideoInfo" ref="appendVideoForm">
        <el-form-item label="视频标题" prop="videoName">
          <el-input v-model="appendVideoInfo.videoName"></el-input>
        </el-form-item>
        <el-form-item label="是否试看" prop="tryAndSee">
          <el-radio-group v-model="appendVideoInfo.tryAndSee">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程视频" prop="videoUrl">
          <el-upload
            class="upload-demo"
            ref="upload"
            :accept="accept"
            :action="uploadUrl"
            :limit="1"
            :on-success="addVideoSuccess"
            :on-remove="addVideoRemove"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-col :span="10">
          <el-form-item label="视频时长" prop="duration">
            <el-input placeholder="NaN" disabled v-model="appendVideoInfo.duration"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendVideo">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改课程视频" :visible.sync="updateDialogVisible" width="60%"
               @close="dialogClose('updateVideoForm')">
      <el-form label-position="right" label-width="100px" :model="updateVideoInfo" ref="updateVideoForm">
        <el-form-item label="视频标题" prop="videoName">
          <el-input v-model="updateVideoInfo.videoName"></el-input>
        </el-form-item>
        <el-form-item label="是否试看" prop="tryAndSee">
          <el-radio-group v-model="updateVideoInfo.tryAndSee">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程视频" prop="videoUrl">
          <el-upload
            class="upload-demo"
            ref="upload"
            :accept="accept"
            :action="uploadUrl"
            :limit="1"
            :file-list="fileList"
            :on-success="upVideoSuccess"
            :on-remove="upVideoRemove"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-col :span="10">
          <el-form-item label="视频时长" prop="duration">
            <el-input placeholder="NaN" disabled v-model="updateVideoInfo.duration"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateVideo">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Video',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            videoName: ''
          },
          flag: true
        },
        chapter: {},
        videoList: [],
        accept: 'video/mp4',
        uploadUrl: 'http://localhost:8081/VideoController/upload',
        appendDialogVisible: false,
        appendVideoInfo: {
          videoId: null,
          videoName: null,
          videoUrl: null,
          tryAndSee: 0,
          duration: null,
          chapterId: null
        },
        updateDialogVisible: false,
        fileList: [],
        updateVideoInfo: {
          videoId: null,
          videoName: null,
          videoUrl: null,
          tryAndSee: null,
          duration: null,
          chapterId: null
        }
      }
    },
    methods: {
      findChapterVideo: async function () {
        this.chapter = Object.assign(this.chapter, JSON.parse(sessionStorage.getItem('chapter')))
        const { data: res } = await this.$http.post('VideoController/findAllByChapter', {
          pages: this.pages,
          chapterId: this.chapter.chapterId
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.videoList = res.data.videoList
        this.pages = res.pages
      },
      remove: async function (videoId) {
        const result = await this.$confirm('是否删除此视频课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (result !== 'confirm') {
          return
        }
        const { data: res } = await this.$http.delete(`VideoController/remove/${videoId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findChapterVideo()
      },
      appendVideo: async function () {
        this.appendVideoInfo.chapterId = this.chapter.chapterId
        const { data: res } = await this.$http.put('VideoController/append', this.appendVideoInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findChapterVideo()
        this.appendDialogVisible = false
      },
      addVideoSuccess: function (res, file, fileList) {
        this.appendVideoInfo.videoUrl = res.data.url
        let audio = new Audio(res.data.url)
        let _this = this
        audio.addEventListener('loadedmetadata', function (event) {
          _this.appendVideoInfo.duration = Number.parseInt(audio.duration)
        })
      },
      addVideoRemove: function (file, fileList) {
        this.appendCourseInfo.videoUrl = null
      },
      showUpdateDialog: async function (videoId) {
        const { data: res } = await this.$http.get(`VideoController/findById/${videoId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateVideoInfo = res.data.video
        this.fileList = [{
          name: 'video',
          url: this.updateVideoInfo.videoUrl
        }]
        this.updateDialogVisible = true
      },
      updateVideo: async function () {
        this.updateVideoInfo.chapterId = this.chapter.chapterId
        const { data: res } = await this.$http.put('VideoController/update', this.updateVideoInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findChapterVideo()
        this.updateDialogVisible = false
      },
      upVideoSuccess: function (res, file, fileList) {
        this.updateVideoInfo.videoUrl = res.data.url
        let audio = new Audio(res.data.url)
        let _this = this
        audio.addEventListener('loadedmetadata', function (event) {
          _this.updateVideoInfo.duration = Number.parseInt(audio.duration)
        })
      },
      upVideoRemove: function (file, fileList) {
        this.updateVideoInfo.videoUrl = null
        this.updateVideoInfo.duration = null
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.findChapterVideo()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.findChapterVideo()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.findChapterVideo()
      },
      dialogClose: function (formRef) {
        this.$refs.upload.clearFiles()
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.findChapterVideo()
    }
  }
</script>

<style scoped>

</style>
