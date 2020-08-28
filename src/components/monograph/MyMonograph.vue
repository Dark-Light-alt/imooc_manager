<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>构建专刊</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="关键词" v-model="pages.searchs.keyword" clearable @clear="findAll">
            <el-button slot="append" icon="el-icon-search" @click="findAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">添加专刊</el-button>
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
        <el-table-column prop="cover" label="封面"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.offShelf == 0">未完成</el-tag>
            <el-tag type="warning" v-else>已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
           <!-- <el-button size="mini" type="primary" @click="appendDialog(scope.row.monographId)"
                       v-if="scope.row.offShelf == 0">添加章节
            </el-button>-->
            <el-button size="mini" type="primary" @click="updateDialog(scope.row.monographId)"
                       v-if="scope.row.offShelf == 0">修改
            </el-button>
            <el-button size="mini" type="danger" @click="deleteMonograph(scope.row.monographId)">删除
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

    <el-dialog title="添加专刊" :visible.sync="appendDialogVisible" width="50%" @close="dialogClose('appendForm')">
      <el-form label-position="right" label-width="100px" :model="appendMonographInfo" ref="appendForm">
        <el-form-item label="专刊标题" prop="monographName">
          <el-input v-model="appendMonographInfo.monographName"></el-input>
        </el-form-item>
        <el-form-item label="背景图" prop="cover">
          <el-input v-model="appendMonographInfo.cover"></el-input>
        </el-form-item>
        <el-form-item label="亮点" prop="highlights">
          <el-input v-model="appendMonographInfo.highlights"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="monographAbout">
          <el-input v-model="appendMonographInfo.monographAbout"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="append()">确定</el-button>
      </span>
    </el-dialog>

   <!-- <el-dialog title="添加章节" :visible.sync="appendChapterDialogVisible" width="50%" @close="dialogClose('appendForm')">
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
-->


    <el-dialog title="修改专刊信息" :visible.sync="updateDialogVisible" width="50%" @close="dialogClose('updateForm')">
      <el-form label-position="right" label-width="100px" :model="appendMonographInfo" ref="updateForm">
        <el-form-item label="专刊标题" prop="monographName">
          <el-input v-model="updateMonographInfo.monographName"></el-input>
        </el-form-item>
        <el-form-item label="背景图" prop="cover">
          <el-input v-model="updateMonographInfo.cover"></el-input>
        </el-form-item>
        <el-form-item label="亮点" prop="highlights">
          <el-input v-model="updateMonographInfo.highlights"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="monographAbout">
          <el-input v-model="updateMonographInfo.monographAbout"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="update()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'MyMonograph',
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
        appendDialogVisible: false,
        appendMonographInfo: {
          monographName: null,
          cover: null,
          highlights: null,
          monographAbout: null,
          author: null
        },
      /*  appendChapterDialogVisible: false,
        appendChapterInfo: {
          chapterName: null,
          chapterAbout: null,
          chapterType: 1,
          chapterResource: null
        },*/
        updateDialogVisible:false,
        updateMonographInfo:{
          monographName: null,
          cover: null,
          highlights: null,
          monographAbout: null
        }
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.post('MonographController/pageFindMonographAuthor',
          {
            pages: this.pages,
            employeeId: this.employeeInfo.employeeId
          })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.monographList = res.data.monographList
        this.pages = res.pages
      },
      append: async function () {
        const { data: res } = await this.$http.put('MonographController/append', this.appendMonographInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.appendDialogVisible = false
        this.findAll()
        this.$message.success(res.meta.msg)
      },
     /* appendDialog: async function (monographId) {
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
      },*/
      updateDialog: async function(monographId){
        const { data: res } = await this.$http.get(`MonographController/findById/${monographId}`);
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg);
        }
        this.updateMonographInfo = Object.assign(this.updateMonographInfo, res.data.monograph);
        this.updateDialogVisible = true;
      },
      update: async function () {
        const { data: res } = await this.$http.put('MonographController/update', this.updateMonographInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg);
        this.updateDialogVisible = false;
        this.findAll();
      },
      deleteMonograph: async function (monographId) {
        const result = await this.$confirm('删除专栏将会删除专栏下的所有章节和文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.get(`MonographController/delete/${monographId}`)
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
      this.employeeInfo = JSON.parse(sessionStorage.getItem('employeeInfo'))
      this.appendMonographInfo.author = this.employeeInfo.employeeId;
      this.findAll();
    }
  }
</script>

<style scoped>
</style>
