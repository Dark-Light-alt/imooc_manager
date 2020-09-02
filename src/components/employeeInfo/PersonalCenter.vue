<template>
  <div class="PersonalCenter">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-form label-position="right" label-width="100px" :model="employeeInfo">
          <el-form-item label="头像 :" style="margin-left: 300px">
            <el-avatar :size="100" :src="employeeInfo.photo"></el-avatar>
          </el-form-item>
          <el-form-item label="上传头像" prop="photo" style="width: 500px;margin-left: 300px">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="uploadUrl"
              :limit="2"
              :accept="accept"
              :on-success="upPhotoSuccess"
              :on-remove="upPhotoRemove"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="姓名" prop="employeeName" style="width: 350px;margin-left: 300px">
            <el-input v-model="employeeInfo.employeeName"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="employeeIdcard" style="width: 350px;margin-left: 300px">
            <el-input v-model="employeeInfo.employeeIdcard"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="employeePhone" style="width: 350px;margin-left: 300px">
            <el-input v-model="employeeInfo.employeePhone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="employeeEmail" style="width: 350px;margin-left: 300px">
            <el-input v-model="employeeInfo.employeeEmail"></el-input>
          </el-form-item>
          <el-form-item label="现居住地" prop="employeeAddress" style="width: 350px;margin-left: 300px">
            <el-input v-model="employeeInfo.employeeAddress"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="employeeSex" style="width: 350px;margin-left: 300px">
            <el-radio-group v-model="employeeInfo.employeeSex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <span style="margin-left: 400px">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="update()">确定</el-button>
          </span>
        </el-form>

    </el-card>

  </div>
</template>

<script>
  export default {
    name: "PersonalCenter",
    data() {
      return {
        employeeInfo: {},
        updateDialogVisible: false,
        uploadUrl: 'http://localhost:8081/EmployeeInfoController/upload',
        fileList: [],
        accept: 'image/jpg,image/jpeg,image/png'
      }
    },
    created: function () {
      this.findById();
    },
    methods: {
      findById: async function () {
        const employeeId = JSON.parse(sessionStorage.getItem("employeeInfo")).employeeId
        const {data: res} = await this.$http.get(`EmployeeInfoController/findById/${employeeId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.employeeInfo = res.data.employeeInfo
      },
      update: async function () {
        const {data: res} = await this.$http.put('EmployeeInfoController/update', this.employeeInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findById()
        this.updateDialogVisible = false
      },
      close:function () {
        this.$router.push("Home")
      }
      ,
      upPhotoSuccess: function (res, file, fileList) {
        this.employeeInfo.photo = res.data.url
      },
      upPhotoRemove: function (file, fileList) {
        this.employeeInfo.photo = null
      },
      dialogClose: function (formRef) {
        this.$refs.upload.clearFiles()
        this.$refs[formRef].resetFields()
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>
