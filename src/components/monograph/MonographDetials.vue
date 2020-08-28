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
            <el-col v-for="(item,index) in scope.row.chapterList" :key="index">
              <span><b>第{{index+1}}章</b></span>&nbsp;&nbsp;
              <span>{{item.chapterName }}</span><br><br>
              &nbsp;&nbsp;<span>{{ item.chapterAbout }}</span><br><br>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="monographName" label="专刊标题"></el-table-column>
        <el-table-column prop="cover" label="封面"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="appendDialog(scope.row.monographId)"
                       v-if="scope.row.offShelf == 0">添加章节
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

    <el-dialog title="添加章节" :visible.sync="appendChapterDialogVisible" width="50%" @close="dialogClose('appendForm')">
      <el-form label-position="right" label-width="100px" :model="appendChapterInfo" ref="appendForm">
        <input v-model="appendChapterInfo.chapterResource" type="hidden"/>
        <el-form-item label="章节标题" prop="chapterName">
          <el-input v-model="appendChapterInfo.chapterName"></el-input>
        </el-form-item>
        <el-form-item label="章节简介" prop="chapterAbout">
          <el-input v-model="appendChapterInfo.chapterAbout"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendChapterDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendChapter()">确定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: 'MonographDetials',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            keyword: ''
          },
          flag: true
        },
        monographList: [],
        appendChapterDialogVisible: false,
        appendChapterInfo: {
          chapterName: null,
          chapterAbout: null,
          chapterType: 1,
          chapterResource: null
        }
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('MonographController/pageFindMonograph', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.monographList = res.data.monographList
        this.pages = res.pages
      },
      appendDialog: async function (monographId) {
        this.appendChapterInfo.chapterResource = monographId
        this.appendChapterDialogVisible = true
      },
      appendChapter: async function () {
        const { data: res } = await this.$http.put('ChapterController/append', this.appendChapterInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.appendChapterDialogVisible = false
        this.findAll()
        this.$message.success(res.meta.msg)
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
