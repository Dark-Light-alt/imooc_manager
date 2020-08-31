<template>
  <div class="changePassword">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form :model="resetForm" ref="resetForm" status-icon label-width="100px">
        <el-form-item label="原密码 :">
          <el-input v-model="selectaccountNumberInfo.accountNumber.password" @blur="findEmployeeId" ></el-input>
        </el-form-item>
        <el-form-item label="新密码 :">
          <el-input type="password" v-model="resetForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码 :">
          <el-input type="password" v-model="resetForm.checkPssword" auto-complete="off"></el-input>
        </el-form-item>
        <span >
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="update()">确定</el-button>
        </span>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "ChangePassword",
    data:function () {
      return {
        resetForm:{
          password:"",
          newPassword:"",
          checkPssword:""
        }
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
