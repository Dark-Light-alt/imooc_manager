<template>
  <div class="department">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="部门名称" v-model="pages.searchs.departmentName" clearable @clear="pagingFindAll">
            <el-button slot="append" icon="el-icon-search" @click="pagingFindAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">添加部门</el-button>
        </el-col>
      </el-row>
      <el-table :data="departmentList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="departmentName" label="部门名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showUpdateDialog(scope.row.departmentId)">修改职位</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row.departmentId)">删除部门</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="添加部门" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendDepartmentForm')">
      <el-form label-position="right" label-width="100px" :model="appendDepartmentInfo" ref="appendDepartmentForm">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="appendDepartmentInfo.departmentName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendDepartment">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改部门" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updateDepartmentForm')">
      <el-form label-position="right" label-width="100px" :model="updateDepartmentInfo" ref="updateDepartmentForm">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="updateDepartmentInfo.departmentName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateDepartment">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Department',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            departmentName: ''
          },
          flag: true
        },
        departmentList: [],
        appendDialogVisible: false,
        appendDepartmentInfo: {
          departmentName: null
        },
        updateDialogVisible: false,
        updateDepartmentInfo: {
          departmentId: null,
          departmentName: null
        }
      }
    },
    methods: {
      pagingFindAll: async function () {
        const { data: res } = await this.$http.post('DepartmentController/pagingFindAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.departmentList = res.data.departmentList
        this.pages = res.pages
      },
      appendDepartment: async function () {
        const { data: res } = await this.$http.put('DepartmentController/append', this.appendDepartmentInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.appendDialogVisible = false
        this.pagingFindAll()
        this.$message.success(res.meta.msg)
      },
      showUpdateDialog: async function (departmentId) {
        const { data: res } = await this.$http.get(`DepartmentController/findById/${departmentId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateDepartmentInfo = Object.assign(this.updateDepartmentInfo, res.data.department)
        this.updateDialogVisible = true
      },
      updateDepartment: async function () {
        const { data: res } = await this.$http.put('DepartmentController/update', this.updateDepartmentInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.updateDialogVisible = false
        this.pagingFindAll()
      },
      remove: async function (departmentId) {
        const result = await this.$confirm('是否删除此部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.delete(`DepartmentController/remove/${departmentId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.pagingFindAll()
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.pagingFindAll()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.pagingFindAll()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.pagingFindAll()
      },
      dialogClose: function (formRef) {
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.pagingFindAll()
    }
  }
</script>

<style scoped>

</style>
