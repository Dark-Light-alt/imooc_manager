<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">专刊管理</el-breadcrumb-item>
      <el-breadcrumb-item>所有专刊</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="关键词" v-model="pages.searchs.keyword" clearable @clear="findAll">
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
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="monographName" label="专刊标题" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cover" label="封面">
          <template slot-scope="scope">
            <el-image
              style="border-radius: 5px"
              :src="scope.row.cover"
              fit="scale-down">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="employeeInfo.employeeName" label="作者"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.offShelf == 1">未上架</el-tag>
            <el-tag type="success" v-else-if="scope.row.offShelf == 2">已上架</el-tag>
            <el-tag type="danger" v-else-if="scope.row.offShelf == 3">已下架</el-tag>
            <el-tag type="warning" v-else-if="scope.row.offShelf == 0">未完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="showChapterByMonographId(scope.row)">预览</el-button>
            <el-button type="success" size="mini" @click="putAway(scope.row.monographId)"
                       v-if="scope.row.offShelf!=2">上架</el-button>
            <el-button type="danger" size="mini" @click="soldOut(scope.row.monographId)"
                       v-if="scope.row.offShelf==2">下架</el-button>
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
    name: 'AllMonograph',
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
        chapters: []
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('MonographController/pageFindMonographAuthor',
          {
            pages: this.pages,
            employeeId: null
          })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.monographList = res.data.monographList
        this.pages = res.pages
      },
      showChapterByMonographId: async function(row){
        sessionStorage.setItem('monograph', JSON.stringify(row))
        this.$router.push({ name: 'PreviewMonograph'});
      },
      putAway: async function (monographId) {
        const result = await this.$confirm('是否上架此专刊, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }
        //上架
        const {data: res } = await this.$http.post("MonographController/updateOffShelf",{
          monographId: monographId,
          offShelf: 2
        })
        if(!res.meta.access){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
      },
      soldOut: async function (monographId) {
        //下架
        const result = await this.$confirm('是否下架此专刊, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const {data: res} = await this.$http.post("MonographController/updateOffShelf",{
          monographId: monographId,
          offShelf: 3
        })
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
