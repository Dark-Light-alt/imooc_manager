<template>
  <div class="customer">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>讲师管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="用户名称" v-model="pages.searchs.customerNickname" clearable @clear="pagingFindAll">
            <el-button slot="append" icon="el-icon-search" @click="pagingFindAll"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="customerList">

        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left">
              <el-form-item label="用户昵称">
                <span>{{ scope.row.customerNickname }}</span>
              </el-form-item>
              <el-form-item label="用户邮箱">
                <span>{{ scope.row.customerEmail }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ scope.row.customerPhone }}</span>
              </el-form-item>
              <el-form-item label="用户职位">
                <span>{{ scope.row.positionId }}</span>
              </el-form-item>
              <el-form-item label="所在城市">
                <span>{{ scope.row.customerAddress }}</span>
              </el-form-item>
              <el-form-item label="注册日期">
                <span>{{ scope.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="customerNickname" label="姓名"></el-table-column>
        <el-table-column prop="customerPhone" label="联系方式"></el-table-column>
        <el-table-column prop="customerEmail" label="邮箱地址"></el-table-column>
        <el-table-column prop="position.positionName" label="职位"></el-table-column>

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
        name: 'Customer',
      data:function () {
          return{
            pages: {
              currentPage: 1,
              pageSize: 7,
              total: 0,
              lastPage: 0,
              searchs: {
                customerNickname: ''
              },
              flag: true
            },
            customerList:[],
          }
      }
      ,methods:{
        pagingFindAll: async function () {
          const { data: res } = await this.$http.post('CustomerController/pagingFindAll', this.pages)
          if (!res.meta.access) {
            return this.$message.error(res.meta.msg)
          }

          this.customerList = res.data.customerList
          this.pages = res.pages
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
        this. pagingFindAll()
      }

    }
</script>

<style scoped>

</style>
