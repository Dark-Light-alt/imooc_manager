<template>
  <div class="order">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="null">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input placeholder="订单号" v-model="pages.searchs.orderNumber" clearable @clear="findAll">
                <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="orderList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="orderNumber" label="订单号"></el-table-column>
            <el-table-column prop="course.courseName" label="商品名"></el-table-column>
            <el-table-column prop="orderMoney" label="订单金额"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.orderStatus == 0">未支付</el-tag>
                <el-tag type="success" v-if="scope.row.orderStatus == 1">已支付</el-tag>
                <el-tag type="danger" v-if="scope.row.orderStatus == 2">已失效</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="未支付" name="0">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input placeholder="订单号" v-model="pages.searchs.orderNumber" clearable @clear="findAll">
                <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="orderList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="orderNumber" label="订单号"></el-table-column>
            <el-table-column prop="course.courseName" label="商品名"></el-table-column>
            <el-table-column prop="orderMoney" label="订单金额"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间"></el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="1">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input placeholder="订单号" v-model="pages.searchs.orderNumber" clearable @clear="findAll">
                <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="orderList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="orderNumber" label="订单号"></el-table-column>
            <el-table-column prop="course.courseName" label="商品名"></el-table-column>
            <el-table-column prop="orderMoney" label="订单金额"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间"></el-table-column>
            <el-table-column prop="paymentTime" label="支付时间">
              <template slot-scope="scope">
                {{scope.row.paymentTime !== null ? scope.row.paymentTime : 'N/A'}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="已失效" name="2">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input placeholder="订单号" v-model="pages.searchs.orderNumber" clearable @clear="findAll">
                <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="orderList">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="orderNumber" label="订单号"></el-table-column>
            <el-table-column prop="course.courseName" label="商品名"></el-table-column>
            <el-table-column prop="orderMoney" label="订单金额"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间"></el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                         :current-page="pages.currentPage"
                         :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                         :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'Order',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          lastPage: 0,
          searchs: {
            orderNumber: ''
          },
          flag: true
        },
        activeName: 'null',
        orderList: []
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('OrdersController/findAll', {
          pages: this.pages,
          status: this.activeName
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.orderList = res.data.orderList
        this.pages = res.pages
      },
      handleClick: function (tab, event) {
        this.activeName = tab.name
        this.findAll()
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
      },
      dialogClose: function (formRef) {
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.findAll()
    }
  }
</script>

<style scoped>

</style>
