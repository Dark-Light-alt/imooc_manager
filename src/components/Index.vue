<template>
  <div class="index">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper custom">
            <i class="el-icon-s-custom card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Customers
            </div>
            <count-to :start-val="0" :end-val="customerCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper course">
            <i class="el-icon-reading card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Courses
            </div>
            <count-to :start-val="0" :end-val="courseCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper order">
            <i class="el-icon-s-order card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Purchases
            </div>
            <count-to :start-val="0" :end-val="orderCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper shopping">
            <i class="el-icon-shopping-cart-1 card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Shoppings
            </div>
            <count-to :start-val="0" :end-val="shoppingCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="map">
      <ve-line :data="incomeData"></ve-line>
    </el-row>
    <el-row class="map">
      <ve-line :data="orderData" :settings="orderSettings"></ve-line>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'

  export default {
    components: {
      CountTo
    },
    name: 'Index',
    data: function () {
      this.orderSettings = {
        axisSite: { right: ['支付率'] },
        yAxisName: ['数值', '比率']
      }
      return {
        customerCount: 0,
        courseCount: 0,
        orderCount: 0,
        shoppingCount: 0,
        incomeData: {
          columns: ['日期', '收入'],
          rows: [
            {
              '日期': '1月',
              '收入': 88
            },
            {
              '日期': '2月',
              '收入': 653
            },
            {
              '日期': '3月',
              '收入': 785
            },
            {
              '日期': '4月',
              '收入': 235
            },
            {
              '日期': '5月',
              '收入': 36.35
            }
          ]
        },
        orderData: {
          columns: ['日期', '下单量', '支付率'],
          rows: [
            {
              '日期': '1/1',
              '下单量': 23,
              '支付率': 0.88
            },
            {
              '日期': '1/2',
              '下单量': 78,
              '支付率': 0.55
            },
            {
              '日期': '1/3',
              '下单量': 55,
              '支付率': 0.33
            },
            {
              '日期': '1/4',
              '下单量': 12,
              '支付率': 0.38
            },
            {
              '日期': '1/5',
              '下单量': 22,
              '支付率': 0.89
            },
            {
              '日期': '1/6',
              '下单量': 81,
              '支付率': 0.78
            }
          ]
        }
      }
    },
    methods: {
      // 查询用户数量
      findCustomerCount: async function () {
        const { data: res } = await this.$http.get('CustomerController/findCustomerCount')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.customerCount = res.data.count
      },
      // 查询已上架的课程数量
      findCourseCount: async function () {
        const { data: res } = await this.$http.get('CourseController/findCourseCount')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.courseCount = res.data.count
      },
      // 查询已支付的订单数量
      findOrderCount: async function () {
        const { data: res } = await this.$http.get('OrdersController/findOrderCount')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.orderCount = res.data.count
      },
      // 查询加入购物车的商品数量
      findShoppingCount: async function () {
        const { data: res } = await this.$http.get('ShoppingCartController/findShoppingCount')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.shoppingCount = res.data.count
      }
    },
    created: function () {
      this.findCustomerCount()
      this.findCourseCount()
      this.findOrderCount()
      this.findShoppingCount()
    }
  }
</script>

<style lang="less" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .custom {
          background: #40c9c6;
        }

        .course {
          background: #36a3f7;
        }

        .order {
          background: #f4516c;
        }

        .shopping {
          background: #34bfa3
        }
      }

      .custom {
        color: #40c9c6;
      }

      .course {
        color: #36a3f7;
      }

      .order {
        color: #f4516c;
      }

      .shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;
    }
  }

  .map {
    background: rgb(255, 255, 255);
    padding: 16px 16px 0px;
    margin-bottom: 32px;
  }
</style>
