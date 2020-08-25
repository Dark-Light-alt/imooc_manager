<template>
  <div class="employeeInfo">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">添加员工</el-button>
        </el-col>
      </el-row>
      <el-table :data="employeeInfoList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left">
              <el-form-item label="姓名">
                <span>{{ scope.row.employeeName }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span>{{ scope.row.employeeSex === 0 ? '男' : '女' }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ scope.row.employeePhone }}</span>
              </el-form-item>
              <el-form-item label="邮箱地址">
                <span>{{ scope.row.employeeEmail }}</span>
              </el-form-item>
              <el-form-item label="身份证号">
                <span>{{ scope.row.employeeIdcard }}</span>
              </el-form-item>
              <el-form-item label="现居住地">
                <span>{{ scope.row.employeeAddress }}</span>
              </el-form-item>
              <el-form-item label="入职日期">
                <span>{{ scope.row.hiredate }}</span>
              </el-form-item>
              <el-form-item label="离职日期" v-if="scope.row.isleave == 1">
                <span>{{ scope.row.leaveDate }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="employeeName" label="姓名"></el-table-column>
        <el-table-column prop="employeePhone" label="联系方式"></el-table-column>
        <el-table-column prop="employeeEmail" label="邮箱地址"></el-table-column>
        <el-table-column prop="isleave" label="是否离职">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isleave == 0">在职</el-tag>
            <el-tag type="danger" v-else>离职</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.isleave == 0"
                       @click="resignation(scope.row.employeeId)">办理离职
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="添加用户信息" :visible.sync="appendDialogVisible" width="50%" @close="dialogClose('appendForm')">
      <el-form label-position="right" label-width="100px" :model="appendEmployeeInfo" ref="appendForm">
        <el-form-item label="姓名" prop="employeeName">
          <el-input v-model="appendEmployeeInfo.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="employeeIdcard">
          <el-input v-model="appendEmployeeInfo.employeeIdcard"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="employeePhone">
          <el-input v-model="appendEmployeeInfo.employeePhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="employeeEmail">
          <el-input v-model="appendEmployeeInfo.employeeEmail"></el-input>
        </el-form-item>
        <el-form-item label="现居住地" prop="employeeAddress">
          <el-input v-model="appendEmployeeInfo.employeeAddress"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="employeeSex">
          <el-radio-group v-model="appendEmployeeInfo.employeeSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-input v-model="appendEmployeeInfo.departmentId"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="positionId">
          <el-input v-model="appendEmployeeInfo.positionId"></el-input>
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
    name: 'EmployeeInfo',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            name: '',
            phone: ''
          },
          flag: true
        },
        employeeInfoList: [],
        appendDialogVisible: false,
        appendEmployeeInfo: {
          employeeName: null,
          employeeIdcard: null,
          employeePhone: null,
          employeeEmail: null,
          employeeAddress: null,
          employeeSex: 0,
          departmentId: null,
          positionId: null
        }
      }
    },
    methods: {

      findAll: async function () {
        const { data: res } = await this.$http.post('EmployeeInfoController/findAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.employeeInfoList = res.data.employeeInfoList
      },

      append: async function () {
        const { data: res } = await this.$http.put('EmployeeInfoController/append', this.appendEmployeeInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.appendDialogVisible = false
        this.findAll()
        this.$message.success(res.meta.msg)
      },
      resignation: async function (employeeId) {
        const result = await this.$confirm('是否为此员工办理离职, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.get(`EmployeeInfoController/resignation/${employeeId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
      },
      sizeChange: async function (newSize) {
        this.page.pageSize = newSize
        this.findAll()
      },
      currentChange: async function (newPage) {
        this.page.currentPage = newPage
        this.findAll()
      },
      currentPage: async function (newPage) {
        this.page.currentPage = newPage
        this.findAll()
      },
      dialogClose: function (formRef) {
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
