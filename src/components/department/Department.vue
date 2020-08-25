<template>
  <div style="border: 1px;background-color: pink">

    <el-button type="primary" @click="showDialog()">添加部门</el-button>

    <el-table width="100%" border :data="department" stripe height="600px">

      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="部门名称" prop="departmentName"></el-table-column>

      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>

      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>

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
            pages: {
              currentPage: 1,
              pageSize: 3,
              total: 0,
              lastPage: 0,
              flag: true
            },
            department:[],
            visibleDialog:false,
            updateDepartment:{
              departmentName:null,
            },

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

        findAll: async function(){
          const {data:res} = await this.$http.post('DepartmentController/findAll',this.pages)
          if (!res.meta.access){
            console.log("查失败")
            return this.$message.error(res.meta.msg)
          }
          this.department = res.data().department
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

    }
</script>

<style scoped>

</style>
