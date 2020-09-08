<template>
  <div class="datasManage">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'CourseBuild' }">构建课程</el-breadcrumb-item>
      <el-breadcrumb-item>资料管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3>{{course.courseName}}</h3>
      <p>{{course.courseAbout}}</p>
    </el-card>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="章节名称" v-model="pages.searchs.chapterName" clearable @clear="findAllByCourseId">
            <el-button slot="append" icon="el-icon-search" @click="findAllByCourseId"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" icon="el-icon-upload" @click="appendDialogVisible = true">上传资料</el-button>
        </el-col>
      </el-row>
      <el-table :data="datasList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="dataName" label="资料名称"></el-table-column>
        <el-table-column prop="createTime" label="资料名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-delete" type="danger"
                       @click="remove(scope.row.dataId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="上传资料" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendDatasForm')">
      <el-form label-position="right" label-width="100px" :model="appendDatasInfo" ref="appendDatasForm">
        <el-form-item label="资料名称" prop="dataName">
          <el-input v-model="appendDatasInfo.dataName"></el-input>
        </el-form-item>
        <el-form-item label="资料文件" prop="dataUrl">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :limit="1"
            :on-success="datasSuccess"
            :on-remove="datasRemove"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendDatas">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'DatasManage',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            dataName: ''
          },
          flag: true
        },
        course: {},
        datasList: [],
        uploadUrl: 'http://localhost:8081/DatasController/upload',
        appendDialogVisible: false,
        appendDatasInfo: {
          dataId: null,
          dataName: null,
          dataUrl: null,
          courseId: null
        }
      }
    },
    methods: {
      findAllByCourseId: async function () {
        this.course = Object.assign(this.course, JSON.parse(sessionStorage.getItem('course')))
        const { data: res } = await this.$http.post('DatasController/findAllByCourseId', {
          pages: this.pages,
          courseId: this.course.courseId
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.datasList = res.data.datasList
        this.pages = res.pages
      },
      appendDatas: async function () {
        this.appendDatasInfo.courseId = this.course.courseId
        const { data: res } = await this.$http.put('DatasController/append', this.appendDatasInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAllByCourseId()
        this.appendDialogVisible = false
      },
      remove: async function (dataId) {
        const result = await this.$confirm('是否删除此课程资料, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }
        const { data: res } = await this.$http.delete(`DatasController/remove/${dataId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAllByCourseId()
      },
      datasSuccess: function (res, file, fileList) {
        this.appendDatasInfo.dataUrl = res.data.url
      },
      datasRemove: function (file, fileList) {
        this.appendDatasInfo.dataUrl = null
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.findAllByCourseId()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAllByCourseId()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAllByCourseId()
      },
      dialogClose: function (formRef) {
        this.$refs.upload.clearFiles()
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.findAllByCourseId()
    }
  }
</script>

<style scoped>

</style>
