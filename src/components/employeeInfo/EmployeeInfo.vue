<template>
  <div class="employeeInfo">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="姓名" v-model="pages.searchs.name" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="手机号" v-model="pages.searchs.phone" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="showAppendDialog">添加员工</el-button>
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
            <el-button size="mini" icon="el-icon-edit" type="primary" v-if="scope.row.isleave == 0"
                       @click="showUpdateDialog(scope.row.employeeId)">修改
            </el-button>
            <el-button size="mini" type="danger" v-if="scope.row.isleave == 0"
                       @click="resignation(scope.row.employeeId)">办理离职
            </el-button>
            <el-button size="mini" type="success" v-if="scope.row.isleave == 0 && scope.row.accountNumberId == null"
                       @click="allocationAccountNumberDialogVisible = true,employeeId = scope.row.employeeId">分配账号
            </el-button>
            <el-button size="mini" v-if="scope.row.accountNumberId != null"
                       @click="findAccountNumber(scope.row.accountNumberId)">查询账号
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
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
          <el-select v-model="appendEmployeeInfo.departmentId" placeholder="请选择">
            <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName"
                       :value="item.departmentId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="positionId">
          <el-select v-model="appendEmployeeInfo.positionId" placeholder="请选择">
            <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName"
                       :value="item.positionId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="append">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" width="50%" @close="dialogClose('updateForm')">
      <el-form label-position="right" label-width="100px" :model="updateEmployeeInfo" ref="updateForm">
        <el-form-item label="姓名" prop="employeeName">
          <el-input v-model="updateEmployeeInfo.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="employeeIdcard">
          <el-input v-model="updateEmployeeInfo.employeeIdcard"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="employeePhone">
          <el-input v-model="updateEmployeeInfo.employeePhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="employeeEmail">
          <el-input v-model="updateEmployeeInfo.employeeEmail"></el-input>
        </el-form-item>
        <el-form-item label="现居住地" prop="employeeAddress">
          <el-input v-model="updateEmployeeInfo.employeeAddress"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="employeeSex">
          <el-radio-group v-model="updateEmployeeInfo.employeeSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="updateEmployeeInfo.departmentId" placeholder="请选择">
            <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName"
                       :value="item.departmentId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="positionId">
          <el-select v-model="updateEmployeeInfo.positionId" placeholder="请选择">
            <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName"
                       :value="item.positionId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="update">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配账号" :visible.sync="allocationAccountNumberDialogVisible" width="50%"
               @close="dialogClose('allocationAccountNumberForm')">
      <el-form label-position="right" label-width="100px" :model="accountNumberInfo" ref="allocationAccountNumberForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="accountNumberInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="accountNumberInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="是否锁定" prop="islocked">
          <el-radio-group v-model="accountNumberInfo.islocked">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="allocationAccountNumberDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="allocationAccountNumber">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="所属账号" :visible.sync="accountNumberDialogVisible" width="50%"
               @close="dialogClose('findAccountNumberInfoForm')">
      <el-form label-position="right" label-width="100px" :model="findAccountNumberInfo"
               ref="findAccountNumberInfoForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="findAccountNumberInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="是否锁定" prop="islocked">
          <el-radio-group v-model="findAccountNumberInfo.islocked">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
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
            username: ''
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
        },
        departmentList: [],
        positionList: [],
        updateDialogVisible: false,
        updateEmployeeInfo: {
          employeeId: null,
          employeeName: null,
          employeeIdcard: null,
          employeePhone: null,
          employeeEmail: null,
          employeeAddress: null,
          employeeSex: null,
          departmentId: null,
          positionId: null
        },
        allocationAccountNumberDialogVisible: false,
        employeeId: null,
        accountNumberInfo: {
          username: null,
          password: null,
          islocked: 0
        },
        accountNumberDialogVisible: false,
        findAccountNumberInfo: {}
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('EmployeeInfoController/findAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.employeeInfoList = res.data.employeeInfoList
        this.pages = res.pages
      },
      showAppendDialog: async function () {
        const { data: department } = await this.$http.get('DepartmentController/findAll')

        if (!department.meta.access) {
          return this.$message.error(department.meta.msg)
        }
        this.departmentList = department.data.departmentList

        const { data: position } = await this.$http.get('PositionController/findAll')

        if (!position.meta.access) {
          return this.$message.error(position.meta.msg)
        }
        this.positionList = position.data.positionList

        this.appendDialogVisible = true
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
      showUpdateDialog: async function (employeeId) {
        const { data: res } = await this.$http.get(`EmployeeInfoController/findById/${employeeId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateEmployeeInfo = Object.assign(this.updateEmployeeInfo, res.data.employeeInfo)

        const { data: department } = await this.$http.get('DepartmentController/findAll')

        if (!department.meta.access) {
          return this.$message.error(department.meta.msg)
        }
        this.departmentList = department.data.departmentList

        const { data: position } = await this.$http.get('PositionController/findAll')

        if (!position.meta.access) {
          return this.$message.error(position.meta.msg)
        }
        this.positionList = position.data.positionList

        this.updateDialogVisible = true
      },
      update: async function () {
        const { data: res } = await this.$http.put('EmployeeInfoController/update', this.updateEmployeeInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.updateDialogVisible = false
        this.findAll()
      },
      allocationAccountNumber: async function () {
        const { data: res } = await this.$http.put('EmployeeInfoController/allocationAccountNumber', {
          employeeId: this.employeeId,
          accountNumber: this.accountNumberInfo
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.allocationAccountNumberDialogVisible = false
        this.findAll()
      },
      findAccountNumber: async function (accountNumberId) {
        const { data: res } = await this.$http.get(`AccountNumberController/findById/${accountNumberId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.findAccountNumberInfo = res.data.accountNumber
        this.accountNumberDialogVisible = true
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
      this.findAll()
    }
  }
</script>

<style scoped>
</style>
