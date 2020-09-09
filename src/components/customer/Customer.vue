<template>
  <div class="customer">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="手机号" v-model="pages.searchs.phone" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="邮箱" v-model="pages.searchs.email" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="customerList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="customerPhoto" label="头像">
          <template slot-scope="scope">
            <el-image :src="scope.row.customerPhoto" style="width: 50px;height: 50px;border-radius: 25px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="customerNickname" label="昵称"></el-table-column>
        <el-table-column prop="customerPhone" label="联系方式"></el-table-column>
        <el-table-column prop="customerEmail" label="邮箱地址">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.customerEmail == null" type="warning">未绑定</el-tag>
            <span v-if="scope.row.customerEmail !== null">{{scope.row.customerEmail}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>
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
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            phone: '',
            email: ''
          },
          flag: true
        },
        customerList: []
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('CustomerController/findAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.customerList = res.data.customerList
        this.pages = res.pages
      },
      sizeChange: async function (newSize) {
        this.pages.pageSize = newSize
        this.findAll()
      },
      currentChange: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAll()
      },
      currentPage: async function (newPage) {
        this.pages.currentPage = newPage
        this.findAll()
      }
    },
    created: function () {
      this.findAll()
    }
  }
</script>

<style scoped>

</style>
