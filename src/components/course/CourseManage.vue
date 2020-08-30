<template>
  <div class="courseManage">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs value="pay" :before-leave="cut">
        <el-tab-pane label="实战课程" name="pay">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input placeholder="课程名称" v-model="pages.searchs.payForCourseName" clearable
                        @clear="payForCourseManage">
                <el-button slot="append" icon="el-icon-search" @click="payForCourseManage"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="courseList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left">
                  <el-form-item label="作者">
                    <span>{{ scope.row.employeeInfo.employeeName}}</span>
                  </el-form-item>
                  <el-form-item label="课程方向">
                    <span>{{ scope.row.direction.directionName}}</span>
                  </el-form-item>
                  <el-form-item label="课程类型">
                    <span>{{ scope.row.type.typeName}}</span>
                  </el-form-item>
                  <el-form-item label="课程级别">
                    <span v-if="scope.row.courseLevel === 0">入门</span>
                    <span v-else-if="scope.row.courseLevel === 1">初级</span>
                    <span v-else-if="scope.row.courseLevel === 2">中级</span>
                    <span v-else>高级</span>
                  </el-form-item>
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
            <el-table-column prop="price" label="价格">
              <template slot-scope="scope">
                {{scope.row.price || 'N/A'}}
              </template>
            </el-table-column>
            <el-table-column prop="courseStatus" label="状态">
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.courseStatus === 1">未上架</el-tag>
                <el-tag type="success" v-else-if="scope.row.courseStatus === 2">已上架</el-tag>
                <el-tag type="danger" v-else-if="scope.row.courseStatus === 3">已下架</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350px">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showpricingDialog(scope.row.courseId)">定价</el-button>
                <el-button type="success" size="mini" v-if="scope.row.courseStatus == 1 || scope.row.courseStatus == 3"
                           @click="putaway(scope.row,0)">上架
                </el-button>
                <el-button type="danger" size="mini"
                           @click="soldout(scope.row.courseId,0)" v-if="scope.row.courseStatus == 2">下架
                </el-button>
                <el-tooltip class="item" effect="dark" content="课程预览" placement="top-start" :enterable="false">
                  <el-button type="info" size="mini" icon="el-icon-view"
                             @click="previewCourse(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="免费课程" name="free">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input placeholder="课程名称" v-model="pages.searchs.freeForCourseName" clearable
                        @clear="freeForCourseManage">
                <el-button slot="append" icon="el-icon-search" @click="freeForCourseManage"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="courseList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left">
                  <el-form-item label="作者">
                    <span>{{ scope.row.customer.customerReal.actualName}}</span>
                  </el-form-item>
                  <el-form-item label="课程方向">
                    <span>{{ scope.row.direction.directionName}}</span>
                  </el-form-item>
                  <el-form-item label="课程类型">
                    <span>{{ scope.row.type.typeName}}</span>
                  </el-form-item>
                  <el-form-item label="课程级别">
                    <span v-if="scope.row.courseLevel === 0">入门</span>
                    <span v-else-if="scope.row.courseLevel === 1">初级</span>
                    <span v-else-if="scope.row.courseLevel === 2">中级</span>
                    <span v-else>高级</span>
                  </el-form-item>
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
            <el-table-column prop="courseStatus" label="状态">
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.courseStatus === 1">未上架</el-tag>
                <el-tag type="success" v-else-if="scope.row.courseStatus === 2">已上架</el-tag>
                <el-tag type="danger" v-else-if="scope.row.courseStatus === 3">已下架</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="350px">
              <template slot-scope="scope">
                <el-button type="success" size="mini" v-if="scope.row.courseStatus == 1 || scope.row.courseStatus == 3"
                           @click="putaway(scope.row,1)">上架
                </el-button>
                <el-button type="danger" size="mini"
                           @click="soldout(scope.row.courseId,1)" v-if="scope.row.courseStatus == 2">下架
                </el-button>
                <el-tooltip class="item" effect="dark" content="课程预览" placement="top-start" :enterable="false">
                  <el-button type="info" size="mini" icon="el-icon-view"
                             @click="previewCourse(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog title="课程定价" :visible.sync="pricingDialogVisible" width="60%"
               @close="dialogClose('pricingForm')">
      <el-form label-position="right" label-width="100px" :model="courseInfo" ref="pricingForm">
        <el-form-item label="课程标题" prop="courseName">
          <el-input v-model="courseInfo.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-input v-model="courseInfo.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="pricingDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="pricing">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CourseManage',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            payForCourseName: '',
            freeForCourseName: ''
          },
          flag: true
        },
        courseList: [],
        pricingDialogVisible: false,
        courseInfo: {}
      }
    },
    methods: {
      cut: function (activeName, oldActiveName) {
        if (activeName == 'pay') {
          this.payForCourseManage()
        } else {
          this.freeForCourseManage()
        }
      },
      payForCourseManage: async function () {
        const { data: res } = await this.$http.post('CourseController/payForCourseManage', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.courseList = res.data.courseList
        this.pages = res.pages
      },
      freeForCourseManage: async function () {
        const { data: res } = await this.$http.post('CourseController/freeForCourseManage', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.courseList = res.data.courseList
        this.pages = res.pages
      },
      previewCourse: function (course) {
        sessionStorage.setItem('course', JSON.stringify(course))
        this.$router.push({ name: 'PreviewCourse' })
      },
      showpricingDialog: async function (courseId) {
        const { data: res } = await this.$http.get(`CourseController/findById/${courseId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.courseInfo = res.data.course
        this.pricingDialogVisible = true
      },
      pricing: async function () {
        const { data: res } = await this.$http.put('CourseController/pricing', this.courseInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.pricingDialogVisible = false
        this.payForCourseManage()
      },
      putaway: async function (course, flag) {
        if (flag == 0) {
          if (null === course.price) {
            return this.$message.error('该课程还未定价，请先定价')
          }
          const result = await this.$confirm('是否按照此价格上架课程?, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          if (result !== 'confirm') {
            return
          }
        }

        const { data: res } = await this.$http.get(`CourseController/changeStatus/${course.courseId}/2`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('课程上架成功')
        if (flag == 0) {
          return this.payForCourseManage()
        }
        this.freeForCourseManage()
      },
      soldout: async function (courseId, flag) {
        const result = await this.$confirm('是否下架课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (result !== 'confirm') {
          return
        }
        const { data: res } = await this.$http.get(`CourseController/changeStatus/${courseId}/3`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('课程下架成功')
        if (flag == 0) {
          return this.payForCourseManage()
        }
        this.freeForCourseManage()
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.payForCourseManage()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.payForCourseManage()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.payForCourseManage()
      },
      dialogClose: function (formRef) {
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.payForCourseManage()
    }
  }
</script>

<style scoped>

</style>
