<template>
  <div style="border: 1px;background-color: pink">

    <el-button type="primary" @click="showDialog()">添加部门</el-button>

    <el-table width="100%" border :data="department" stripe height="600px">
      <el-table-column label="部门编号" prop="departmentId"></el-table-column>
      <el-table-column label="部门名称" prop="departmentName"></el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="50%" title="编辑信息" :visible.sync="visibleDialog">
      <el-form label-width="100px" label-suffix="：" :model="updateDepartment">

        <el-form-item label="部门名称">
          <el-input v-model="updateDepartment.departmentName"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="update()">修改</el-button>
        <el-button @click="add()">添加</el-button>
        <el-button @click="visibleDialog = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: 'Department',
      data:function () {
          return{
            department:[],
            visibleDialog:false,
            updateDepartment:{},

          }
      },created:function () {
          this.findAll()
      }
      ,methods: {
        showDialog: function (row) {
          this.visibleDialog = true
          if (null == row) {
            this.updateDepartment = {}
          } else {
            this.updateDepartment = Object.assign({}, row);
          }
        },
        findAll: function () {
          let t = this
          this.$http.post('http://localhost:8081/DepartmentController/selectAll').then(function (value) {
            t.department = value.data
          })
        },
        add () {
          let t = this
          this.$http.post('http://localhost:8081/DepartmentController/insert',t.updateDepartment)
            .then(response =>{
              if (response.data==1){
                t.findAll()
                this.visibleDialog = false;
              }else{
                console.log('添加失败')
              }
            }).catch(error => {
            console.log(error)
          })
        },
      }
    }
</script>

<style scoped>

</style>
