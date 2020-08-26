<template>
  <div class="accountNumber">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="用户名" v-model="pages.searchs.username" clearable @clear="pagingFindAll">
            <el-button slot="append" icon="el-icon-search" @click="pagingFindAll"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="accountNumberList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="employeeInfo.employeeName" label="持有者"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="endLoginTime" label="最后登录">
          <template slot-scope="scope">
            {{ scope.row.endLoginTime == null ? 'N/A' : scope.row.endLoginTime }}
          </template>
        </el-table-column>
        <el-table-column prop="islocked" label="是否锁定">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.islocked"
              :active-value="0"
              :inactive-value="1"
              @change="changeLocked(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'AccountNumber',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            username: ''
          },
          flag: true
        },
        accountNumberList: []
      }
    },
    methods: {
      pagingFindAll: async function () {
        const { data: res } = await this.$http.post('AccountNumberController/pagingFindAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.accountNumberList = res.data.accountNumberList
        this.pages = res.pages
      },
      changeLocked: async function (row) {
        const { data: res } = await this.$http.get(`AccountNumberController/changeLocked/${row.accountNumberId}/${row.islocked}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
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
