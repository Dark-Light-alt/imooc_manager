<template>
  <div class="personalCenter">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <el-form v-model="employeeInfo" label-width="100px">
        <el-form-item label="姓名 :">
          <span>{{employeeInfo.employeeName}}</span>
        </el-form-item>
        <el-form-item label="联系方式 :">
          <span>{{employeeInfo.employeePhone}}</span>
        </el-form-item>
        <el-form-item label="性别 :">
          <span>{{employeeInfo.employeeSex==0?'男':'女'}}</span>
        </el-form-item>
        <el-form-item label="邮箱地址 :">
          <span>{{employeeInfo.employeeEmail}}</span>
        </el-form-item>
        <el-form-item label="身份证号 :">
          <span>{{employeeInfo.employeeIdcard}}</span>
        </el-form-item>
        <el-form-item label="地址 :">
          <span>{{employeeInfo.employeeAddress}}</span>
        </el-form-item>
      </el-form>
      <el-button size="mini" type="primary" @click="showUpdateDialog(employeeInfo.employeeId)">修改信息</el-button>

    </el-card>

    <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" width="50%">
      <el-form label-position="right" label-width="100px" :model="employeeInfo" ref="updateForm">
        <el-form-item label="姓名" prop="employeeName">
          <el-input v-model="employeeInfo.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="employeeIdcard">
          <el-input v-model="employeeInfo.employeeIdcard"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="employeePhone">
          <el-input v-model="employeeInfo.employeePhone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="employeeEmail">
          <el-input v-model="employeeInfo.employeeEmail"></el-input>
        </el-form-item>
        <el-form-item label="现居住地" prop="employeeAddress">
          <el-input v-model="employeeInfo.employeeAddress"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="employeeSex">
          <el-radio-group v-model="employeeInfo.employeeSex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="update()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "PersonalCenter",
    data: function () {
      return {
        employeeInfo: {},

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

      }
    },
    methods: {
      //个人中心
      findData: async function () {
        const employeeId = JSON.parse(sessionStorage.getItem("employeeInfo")).employeeId
        const {data: res} = await this.$http.get(`EmployeeInfoController/findById/${employeeId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.employeeInfo = res.data.employeeInfo
      },

      showUpdateDialog: async function (employeeId) {

        this.updateDialogVisible = true
      },

      update: async function () {
        const {data: res} = await this.$http.put('EmployeeInfoController/update', this.employeeInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.updateDialogVisible = false
        this.findData()
      },
    },

    created: function () {
      this.findData()
    }
  }
</script>

<style scoped>

</style>
