<template>
  <div class="login">
    <el-form :model="user" :rules="rules" ref="loginFef">
      <h3>登录</h3>
      <el-form-item prop="username">
        <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input placeholder="密码" show-password prefix-icon="el-icon-lock" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Login.vue',
    data: function () {
      return {
        user: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {
              required: true,
              message: '用户名不能为空',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 16,
              message: '长度在 5 到 16 个字符',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      login: async function () {
        this.$refs.loginFef.validate(async result => {
          if (result) {
            const { data: res } = await this.$http.post(`login?username=${this.user.username}&password=${this.user.password}`)

            if (!res.meta.access) {
              return this.$message.error(res.meta.msg)
            }
            sessionStorage.setItem('employeeInfo', JSON.stringify(res.data.employeeInfo))
            this.$message.success(res.meta.msg)
            this.$router.push({ name: 'Home' })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login {
    height: 100%;
    background-image: url("../assets/img/background.jpg");
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    background-size: cover;
  }

  h3 {
    text-align: center;
  }

  .el-form {
    border-radius: 6px;
    background: #fff;
    width: 350px;
    padding: 25px 25px 5px 25px;
  }

  .el-button {
    width: 100%;
  }
</style>
