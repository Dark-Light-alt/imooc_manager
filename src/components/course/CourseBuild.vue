<template>
  <div class="courseBuild">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>构建课程</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="课程名称" v-model="pages.searchs.courseName" clearable @clear="findByAuthor">
            <el-button slot="append" icon="el-icon-search" @click="findByAuthor"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">新建课程</el-button>
        </el-col>
      </el-row>
      <el-table :data="courseList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left">
              <el-form-item label="课程简介">
                <span>{{ scope.row.courseAbout }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ scope.row.createTime}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="courseName" label="课程名称"></el-table-column>
        <el-table-column prop="cover" label="封面">
          <template slot-scope="scope">
            <el-image
              style="border-radius: 5px"
              :src="scope.row.cover"
              fit="scale-down">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="courseLevel" label="课程级别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.courseLevel === 0">入门</el-tag>
            <el-tag v-else-if="scope.row.courseLevel === 1">初级</el-tag>
            <el-tag v-else-if="scope.row.courseLevel === 2">中级</el-tag>
            <el-tag v-else>高级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="courseStatus" label="进度">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.courseStatus === 0">未完成</el-tag>
            <el-tag type="success" v-else-if="scope.row.courseStatus !== 0">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="课程发布" placement="top-start" :enterable="false">
              <el-button v-if="scope.row.courseStatus === 0" type="success" size="mini"
                         icon="el-icon-check"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="目录管理" placement="top-start" :enterable="false">
              <el-button v-if="scope.row.courseStatus === 0" size="mini" icon="el-icon-tickets"
                         @click="showChapter(scope.row)"></el-button>
            </el-tooltip>
            <el-button v-if="scope.row.courseStatus === 0" size="mini" icon="el-icon-edit" type="primary"
                       @click="showUpdateDialog(scope.row.courseId)"></el-button>
            <el-button v-if="scope.row.courseStatus === 0" size="mini" icon="el-icon-delete" type="danger"
                       @click="remove(scope.row.courseId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="新建课程" :visible.sync="appendDialogVisible" width="60%"
               @close="dialogClose('appendCourseForm')" @open="findType">
      <el-form label-position="right" label-width="100px" :model="appendCourseInfo" ref="appendCourseForm">
        <el-form-item label="课程标题" prop="courseName">
          <el-input v-model="appendCourseInfo.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程简介" prop="courseAbout">
          <el-input type="textarea" v-model="appendCourseInfo.courseAbout"></el-input>
        </el-form-item>
        <el-form-item label="课程封面" prop="cover">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :limit="1"
            :accept="accept"
            :on-success="addCoverSuccess"
            :on-remove="addCoverRemove"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程类型" prop="typeId">
          <el-select v-model="appendCourseInfo.typeId" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.typeId" :label="item.typeName"
                       :value="item.typeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程级别" prop="courseLevel">
          <el-radio-group v-model="appendCourseInfo.courseLevel">
            <el-radio :label="0">入门</el-radio>
            <el-radio :label="1">初级</el-radio>
            <el-radio :label="2">中级</el-radio>
            <el-radio :label="3">高级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendCourse">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改课程" :visible.sync="updateDialogVisible" width="60%"
               @close="dialogClose('updateCourseForm')" @open="findType">
      <el-form label-position="right" label-width="100px" :model="updateCourseInfo" ref="updateCourseForm">
        <el-form-item label="课程标题" prop="courseName">
          <el-input v-model="updateCourseInfo.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程简介" prop="courseAbout">
          <el-input type="textarea" v-model="updateCourseInfo.courseAbout"></el-input>
        </el-form-item>
        <el-form-item label="课程封面" prop="cover">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :limit="1"
            :accept="accept"
            :on-success="upCoverSuccess"
            :on-remove="upCoverRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程类型" prop="typeId">
          <el-select v-model="updateCourseInfo.typeId" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.typeId" :label="item.typeName"
                       :value="item.typeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程级别" prop="courseLevel">
          <el-radio-group v-model="updateCourseInfo.courseLevel">
            <el-radio :label="0">入门</el-radio>
            <el-radio :label="1">初级</el-radio>
            <el-radio :label="2">中级</el-radio>
            <el-radio :label="3">高级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateCourse">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CourseBuild',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            courseName: ''
          },
          flag: true
        },
        courseList: [],
        typeList: [],
        appendDialogVisible: false,
        appendCourseInfo: {
          courseName: null,
          courseAbout: null,
          cover: null,
          author: null,
          typeId: null,
          duration: 0,
          isfree: 0,
          courseLevel: 0
        },
        updateDialogVisible: false,
        updateCourseInfo: {
          courseId: null,
          courseName: null,
          courseAbout: null,
          cover: null,
          author: null,
          typeId: null,
          duration: null,
          isfree: null,
          courseLevel: null
        },
        uploadUrl: 'http://localhost:8081/CourseController/upload',
        fileList: [],
        accept: 'image/jpg,image/jpeg,image/png'
      }
    },
    methods: {
      findByAuthor: async function () {
        const author = JSON.parse(sessionStorage.getItem('employeeInfo')).employeeId
        const { data: res } = await this.$http.post('CourseController/findByAuthor', {
          pages: this.pages,
          author: author
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.courseList = res.data.courseList
        this.pages = res.pages
      },
      findType: async function () {
        const { data: res } = await this.$http.get('TypeController/findAll')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.typeList = res.data.typeList
      },
      appendCourse: async function () {
        const author = JSON.parse(sessionStorage.getItem('employeeInfo')).employeeId
        this.appendCourseInfo.author = author
        const { data: res } = await this.$http.put('CourseController/append', this.appendCourseInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findByAuthor()
        this.appendDialogVisible = false
      },
      showUpdateDialog: async function (courseId) {
        this.findType()
        const { data: res } = await this.$http.get(`CourseController/findById/${courseId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateCourseInfo = res.data.course
        this.fileList = [{
          name: 'cover',
          url: this.updateCourseInfo.cover
        }]
        this.updateDialogVisible = true
      },
      updateCourse: async function () {
        const { data: res } = await this.$http.put('CourseController/update', this.updateCourseInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findByAuthor()
        this.updateDialogVisible = false
      },
      showChapter: async function (row) {
        sessionStorage.setItem('course', JSON.stringify(row))
        this.$router.push({ name: 'CourseChapterManage' })
      },
      remove: async function (courseId) {
        const result = await this.$confirm('是否删除此课程及对应的所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.delete(`CourseController/remove/${courseId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.findByAuthor()
      },
      addCoverSuccess: function (res, file, fileList) {
        this.appendCourseInfo.cover = res.data.url
      },
      addCoverRemove: function (file, fileList) {
        this.appendCourseInfo.cover = null
      },
      upCoverSuccess: function (res, file, fileList) {
        this.updateCourseInfo.cover = res.data.url
      },
      upCoverRemove: function (file, fileList) {
        this.updateCourseInfo.cover = null
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.findByAuthor()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.findByAuthor()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.findByAuthor()
      },
      dialogClose: function (formRef) {
        this.$refs.upload.clearFiles()
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.findByAuthor()
    }
  }
</script>

<style scoped>

</style>
