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
            employeeInfoList:{},
          }
      },
      methods:{
        //个人中心
        PersonalCenter: async function (employeeId) {
          console.log("进来没")
          this.employeeInfoList = sessionStorage.getItem("employeeInfo")
          /*let info = sessionStorage.getItem("employeeInfo");
          console.log("info:"+info)*/
          this.show = true;

          const { data: res } = await this.$http.get('EmployeeInfoController/findById/'+info)
          if (!res.meta.access) {
            return this.$message.error(res.meta.msg)
          }
          console.log(res)
          res.meta=this.employeeInfoList;


        },
      }
    }
</script>

<style scoped>

</style>
