<template>
  <div class="reportReason">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">举报管理</el-breadcrumb-item>
      <el-breadcrumb-item>原因管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">添加举报原因</el-button>
        </el-col>
      </el-row>
      <el-table :data="reportReasonList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="reportReasonName" label="举报原因名"></el-table-column>
        <el-table-column prop="dimension" label="检测维度"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="findById(scope.row.reportReasonId)">修改
            </el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="remove(scope.row.reportReasonId)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加举报原因" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendForm')">
      <el-form label-position="right" label-width="100px" :model="appendInfo" ref="appendForm">
        <el-form-item label="举报原因名" prop="reportReasonName">
          <el-input v-model="appendInfo.reportReasonName"></el-input>
        </el-form-item>
        <el-form-item label="检测维度" prop="dimension">
          <el-input v-model="appendInfo.dimension"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="append">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改举报原因" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updateForm')">
      <el-form label-position="right" label-width="100px" :model="updateInfo" ref="updateForm">
        <el-form-item label="举报原因名" prop="reportReasonName">
          <el-input v-model="updateInfo.reportReasonName"></el-input>
        </el-form-item>
        <el-form-item label="检测维度" prop="dimension">
          <el-input v-model="updateInfo.dimension"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="update">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ReportReason',
    data: function () {
      return {
        reportReasonList: [],
        appendDialogVisible: false,
        appendInfo: {
          reportReasonName: null,
          dimension: null
        },
        updateDialogVisible: false,
        updateInfo: {
          reportReasonId: null,
          reportReasonName: null,
          dimension: null
        }
      }
    },
    methods: {
      findAll: async function () {
        const { data: res } = await this.$http.get('ReportReasonController/findAll')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.reportReasonList = res.data.reportReasonList
      },
      append: async function () {
        const { data: res } = await this.$http.put('ReportReasonController/append', this.appendInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
        this.appendDialogVisible = false
      },
      findById: async function (reportReasonId) {
        const { data: res } = await this.$http.get(`ReportReasonController/findById/${reportReasonId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateInfo = res.data.reportReason
        this.updateDialogVisible = true
      },
      update: async function () {
        const { data: res } = await this.$http.put('ReportReasonController/update', this.updateInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.findAll()
        this.updateDialogVisible = false
      },
      remove: async function (reportReasonId) {
        const result = await this.$confirm('是否删除此举报原因, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }
        const { data: res } = await this.$http.delete(`ReportReasonController/remove/${reportReasonId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
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
