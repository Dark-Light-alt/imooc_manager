<template>
  <div class="changePassword">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="resetForm" status-icon label-width="100px">
        <el-form-item label="原密码 :">
          <el-input v-model="resetForm.password" show-password placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码 :">
          <el-input type="password" v-model="resetForm.newPassword" auto-complete="off" show-password
                    placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码 :">
          <el-input type="password" v-model="resetForm.checkPassword" auto-complete="off" show-password
                    placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-button type="primary" @click="changePassword()">提交修改</el-button>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: "ChangePassword",
    data: function () {
      return {
        resetForm: {
          employeeId: null,
          password: null,
          newPassword: null,
          checkPassword: null
        }
      }
    },

    methods: {
      changePassword: async function () {
        this.resetForm.employeeId = JSON.parse(sessionStorage.getItem("employeeInfo")).employeeId
        const {data: res} = await this.$http.post('AccountNumberController/changePassword', this.resetForm)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push({name: 'Home'})
      }
    }
  }
</script>

<style scoped>

</style>
