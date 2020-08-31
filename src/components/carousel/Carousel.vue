<template>
  <div class="carousel">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">基础管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播控制</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-col :span="12">
        <el-button type="primary" @click="appendDialogVisible = true">添加轮播</el-button>
      </el-col>
      <el-table :data="carouselList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left">
              <el-form-item label="课程简介">
                <span>{{ scope.row.course.courseAbout }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ scope.row.course.createTime}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="course.courseName" label="课程名"></el-table-column>
        <el-table-column label="轮播图">
          <template slot-scope="scope">
            <el-image
              style="border-radius: 5px"
              :src="scope.row.cover"
              fit="scale-down">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" icon="el-icon-delete" type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="添加轮播" :visible.sync="appendDialogVisible" width="60%"
               @close="dialogClose('append')" @open="findCourse">
      <el-form label-position="right" label-width="100px" :model="carousel" ref="append">
        <el-form-item label="轮播课程" prop="courseId">
          <el-select v-model="carousel.courseId" placeholder="请选择">
            <el-option v-for="item in courseList" :key="item.courseId" :label="item.courseName"
                       :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮播封面" prop="cover">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :limit="1"
            :accept="accept"
            :on-success="uploadSuccess"
            :on-remove="uploadRemove"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播排序" prop="sort">
          <el-input-number v-model="carousel.sort" :min="1" :max="9" label="排序 1 - 9"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="append">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {},
          flag: true
        },
        carouselList: [],
        appendDialogVisible: false,
        uploadUrl: 'http://localhost:8081/CarouselController/upload',
        accept: 'image/jpg,image/jpeg,image/png',
        courseList: [],
        carousel: {
          cover: null,
          courseId: null,
          sort: 1
        }
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('CarouselController/findAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.carouselList = res.data.carouselList
        this.pages = res.pages
      },
      findCourse: async function () {
        const { data: res } = await this.$http.get('CourseController/list')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.courseList = res.data.courseList
      },
      append: async function () {
        const { data: res } = await this.$http.put('CarouselController/append', this.carousel)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
        this.appendDialogVisible = false
      },
      uploadSuccess: function (res, file, fileList) {
        this.carousel.cover = res.data.url
      },
      uploadRemove: function (file, fileList) {
        this.carousel.cover = null
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
        this.$refs.upload.clearFiles()
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.findAll()
    }
  }
</script>

<style scoped>

</style>
