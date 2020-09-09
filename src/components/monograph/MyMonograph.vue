<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">专刊管理</el-breadcrumb-item>
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
        <el-table-column prop="cover" label="封面">
          <template slot-scope="scope">
            <el-image
              style="border-radius: 5px"
              :src="scope.row.cover"
              fit="scale-down">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.offShelf == 0">未完成</el-tag>
            <el-tag type="success" v-else>已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="完成专栏" placement="top-start" :enterable="false">
              <el-button v-if="scope.row.offShelf === 0" type="success" size="mini"
                         icon="el-icon-check" @click="updateStatus(scope.row.monographId)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="目录管理" placement="top-start" :enterable="false">
              <el-button v-if="scope.row.offShelf === 0" size="mini" icon="el-icon-tickets"
                         @click="direOper(scope.row)"></el-button>
            </el-tooltip>
            <el-button v-if="scope.row.offShelf === 0" size="mini" icon="el-icon-edit" type="primary"
                       @click="updateDialog(scope.row.monographId)"></el-button>
            <el-button v-if="scope.row.offShelf === 0" size="mini" icon="el-icon-delete" type="danger"
                       @click="deleteMonograph(scope.row.monographId)"></el-button>

            <el-tooltip class="item" effect="dark" content="专刊预览" placement="top-start" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-view"
                         @click="showChapterByMonographId(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" @current-page="currentPage"
                     :current-page="pages.currentPage"
                     :page-sizes="[1,3,5,7,10]" :page-size="pages.pageSize"
                     :total="pages.total" layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>

    <el-dialog title="添加专刊" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendForm')" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" :model="appendMonographInfo" ref="appendForm">
        <el-form-item label="专刊标题" prop="monographName">
          <el-input v-model="appendMonographInfo.monographName"></el-input>
        </el-form-item>
        <el-form-item label="背景图" prop="cover">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :accept="accept"
            :limit="1"
            :on-success="addCoverSuccess"
            :on-remove="addCoverRemove"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="亮点" prop="highlights">
          <el-input type="textarea" v-model="appendMonographInfo.highlights" :rows="3" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="monographAbout">
          <el-input type="textarea" v-model="appendMonographInfo.monographAbout" :rows="5" maxlength="300" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="append()">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改专刊信息" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updateForm')" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" :model="appendMonographInfo" ref="updateForm">
        <el-form-item label="专刊标题" prop="monographName">
          <el-input v-model="updateMonographInfo.monographName"></el-input>
        </el-form-item>
        <el-form-item label="背景图" prop="cover">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :accept="accept"
            :limit="1"
            :on-success="upCoverSuccess"
            :on-remove="upCoverRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="亮点" prop="highlights">
          <el-input type="textarea" v-model="updateMonographInfo.highlights" :rows="3" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="monographAbout">
          <el-input type="textarea" v-model="updateMonographInfo.monographAbout" :rows="5" maxlength="300" show-word-limit></el-input>
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
          highlights: '',
          monographAbout: '',
          author: null
        },
        updateDialogVisible: false,
        updateMonographInfo: {
          monographName: null,
          cover: null,
          highlights: '',
          monographAbout: '',
          author: null
        },
        uploadUrl: 'http://localhost:8081/MonographController/upload',
        accept: 'image/jpg,image/jpeg,image/png',
        fileList: []
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
      updateDialog: async function(monographId){
        const { data: res } = await this.$http.get(`MonographController/findById/${monographId}`);
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg);
        }
        this.updateMonographInfo = Object.assign(this.updateMonographInfo, res.data.monograph);
        this.fileList=[{
          name: 'cover',
          url: this.updateMonographInfo.cover
        }];
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
      showChapterByMonographId: async function(row){
        sessionStorage.setItem('monograph', JSON.stringify(row))
        this.$router.push({ name: 'PreviewMonograph'});
      },
      direOper: async function(row){
        sessionStorage.setItem('monograph', JSON.stringify(row))
        this.$router.push({ name: 'MonogrphChapterManage'});
      },
      updateStatus: async function (monographId) {
        const result = await this.$confirm('完成之后将不能再修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.post(`MonographController/updateOffShelf`,{
          monographId: monographId,
          offShelf: 1
        })
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
      },
      addCoverSuccess : async function(res){
        this.appendMonographInfo.cover=res.data.url;
      },
      addCoverRemove: async function(){
        this.appendMonographInfo.cover=null;
      },
      upCoverSuccess : async function(res){
        this.updateMonographInfo.cover=res.data.url;
      },
      upCoverRemove: async function(){
        this.updateMonographInfo.cover=null;
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
        this.$refs.upload.clearFiles()
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
