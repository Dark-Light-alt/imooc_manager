<template>
  <div class="personalCenter">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <el-table :data="employeeInfoList">
        <el-table-column label="编号" prop="employeeId"></el-table-column>
        <el-table-column label="姓名" prop="employeeName"></el-table-column>
        <el-table-column label="性别" prop="employeeSex"></el-table-column>
        <el-table-column label="电话号码" prop="employeePhone"></el-table-column>
        <el-table-column label="邮箱地址" prop="employeeEmail"></el-table-column>
        <el-table-column label="身份证号" prop="employeeIdcard"></el-table-column>
        <el-table-column label="居住地址" prop="employeeAddress"></el-table-column>
      </el-table>

    </el-card>

  </div>
</template>

<script>
    export default {
        name: "PersonalCenter",

      data:function () {
          return{
            employeeInfoList:[],
          }
      },
      methods:{
        created:function () {
          this.PersonalCenter()
        },
        //个人中心
        PersonalCenter: async function (employeeId) {

          let t = this
          console.log("进来没")
          var employeeInfoList = sessionStorage.getItem("employeeInfo")

          console.log("aa+"+t.employeeInfoList)

          const { data: res } = await this.$http.get('EmployeeInfoController/findById'+t.employeeInfoList)
          if (!res.meta.access) {
            return this.$message.error(res.meta.msg)
          }
          console.log(res)
          t.employeeInfoList = res.data.employeeInfoList
          t.employeeInfoList = res.employeeInfoList

        }

      }
    }
</script>

<style scoped>

</style>
