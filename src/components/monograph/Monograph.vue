<template>
  <div class="employeeInfo">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>专刊管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="关键字" v-model="pages.searchs.keyword" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="monographList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left">
              <el-form-item label="专刊标题">
                <span>{{ scope.row.monographName }}</span>
              </el-form-item>
              <el-form-item label="亮点">
              <span>{{ scope.row.highlights }}</span>
            </el-form-item>
              <el-form-item label="简介">
                <span>{{ scope.row.monographAbout }}</span>
              </el-form-item>
              <el-form-item label="购买人数">
                <span>{{ scope.row.numberOfPurchasers }}</span>
              </el-form-item>
              <el-form-item label="创建日期">
                <span>{{ scope.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="monographName" label="专刊标题" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cover" label="封面"></el-table-column>
        <el-table-column prop="employeeInfo.employeeName" label="作者"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="numberOfPurchasers" label="购买人数"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.offShelf == 0">未上架</el-tag>
            <el-tag type="warning" v-else-if="scope.row.offShelf == 1">已上架</el-tag>
            <el-tag type="danger" v-else-if="scope.row.offShelf == 2">已下架</el-tag>
            <el-tag type="danger" v-else-if="scope.row.offShelf == 4">未完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优惠价格">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.discounts != null && scope.row.offShelf == 1">{{scope.row.price-scope.row.discounts}}</el-tag>
            <el-tag type="danger" v-else-if="scope.row.discounts == null && scope.row.offShelf == 1 && scope.row.price != null">无优惠</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" v-if="scope.row.offShelf == 1 && scope.row.price == null"
                       @click="showUpdateDialog(scope.row.monographId)">定价
            </el-button>
            <el-button size="mini" type="warning" v-if="scope.row.offShelf == 2 && scope.row.price != null"
                       @click="showUpdateDialog(scope.row.monographId)">优惠
            </el-button>
            <el-button size="mini" type="danger" v-if="scope.row.offShelf == 2"
                       @click="soldOut(scope.row.monographId)">下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="定价" :visible.sync="updatePriceVisible" width="50%" @close="dialogClose('updateForm')">
      <el-form label-position="right" label-width="100px" :model="updatePriceInfo" ref="updateForm">
        <el-form-item label="价格" prop="price">
          <el-input v-model="updatePriceInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="可优惠" prop="discounts">
          <el-input v-model="updatePriceInfo.discounts"></el-input>
        </el-form-item>
        <el-form-item label="优惠截止日期" prop="offerEndTime">
          <el-date-picker
            v-model="updatePriceInfo.offerEndTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updatePriceVisible = false">取消</el-button>
          <el-button type="primary" @click="update()">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Monograph',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
          keyword:''
          },
          flag: true
        },
        monographList: [],
        updatePriceVisible: false,
        updatePriceInfo: {
          price:null,
          discounts:null,
          offerEndTime:null
        }
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('MonographController/pageFindMonographAuthor',  {
          pages: this.pages,
          employeeId: null
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.monographList = res.data.monographList;
        this.pages = res.pages;
      },
      showUpdateDialog: async function(monographId){
        const { data: res } = await this.$http.get(`MonographController/findById/${monographId}`);
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg);
        }
        console.log(res.data.monograph);
        this.updatePriceInfo = Object.assign(this.updatePriceInfo, res.data.monograph);
        this.updatePriceVisible = true;
      },
      update: async function () {
        const { data: res } = await this.$http.put('MonographController/update', this.updatePriceInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg);
        this.updatePriceVisible = false;
        this.findAll();
      },
      soldOut: async function (monographId) {
        const result = await this.$confirm('是否下架此商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.get(`MonographController/soldOut/${monographId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
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
