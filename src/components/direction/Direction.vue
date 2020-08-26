<template>
  <div class="direction">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">课程体系</el-breadcrumb-item>
      <el-breadcrumb-item>课程方向</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="名称" v-model="pages.searchs.username" clearable @clear="pagingFindAll">
            <el-button slot="append" icon="el-icon-search" @click="pagingFindAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">添加课程方向</el-button>
        </el-col>
      </el-row>
      <el-table :data="directionList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-col :span="2" v-for="item in scope.row.types" :key="item.typeId">
              <el-tag>{{item.typeName}}</el-tag>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="directionName" label="方向名称"></el-table-column>
        <el-table-column prop="directionIsenable" label="是否锁定">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.directionIsenable"
              :active-value="0"
              :inactive-value="1"
              @change="changeEnable(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="showUpdateDialog(scope.row.directionId)">
              修改
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

    <el-dialog title="添加课程方向" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendDirectionForm')">
      <el-form label-position="right" label-width="100px" :model="appendDirectionInfo" ref="appendDirectionForm">
        <el-form-item label="职位名称" prop="directionName">
          <el-input v-model="appendDirectionInfo.directionName"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="directionIsenable">
          <el-radio-group v-model="appendDirectionInfo.directionIsenable">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendDirection">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改课程方向" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updateDirectionForm')">
      <el-form label-position="right" label-width="100px" :model="updateDirectionInfo" ref="updateDirectionForm">
        <el-form-item label="方向名称" prop="directionName">
          <el-input v-model="updateDirectionInfo.directionName"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="directionIsenable">
          <el-radio-group v-model="updateDirectionInfo.directionIsenable">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateDirection">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Direction',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            directionName: ''
          },
          flag: true
        },
        directionList: [],
        appendDialogVisible: false,
        appendDirectionInfo: {
          directionName: null,
          directionIsenable: 0
        },
        updateDialogVisible: false,
        updateDirectionInfo: {
          directionId: null,
          directionName: null,
          directionIsenable: 0
        }
      }
    },
    methods: {
      pagingFindAll: async function () {
        const { data: res } = await this.$http.post('DirectionController/pagingFindAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.directionList = res.data.directionList
        this.pages = res.pages
      },
      appendDirection: async function () {
        const { data: res } = await this.$http.put('DirectionController/append', this.appendDirectionInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.appendDialogVisible = false
        this.pagingFindAll()
      },
      showUpdateDialog: async function (directionId) {
        const { data: res } = await this.$http.get(`DirectionController/findById/${directionId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateDirectionInfo = res.data.direction
        this.updateDialogVisible = true
      },
      updateDirection: async function () {
        const { data: res } = await this.$http.put('DirectionController/update', this.updateDirectionInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.updateDialogVisible = false
        this.pagingFindAll()
      },
      changeEnable: async function (row) {
        const { data: res } = await this.$http.get(`DirectionController/changeEnable/${row.directionId}/${row.directionIsenable}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
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
      this.pagingFindAll()
    }
  }
</script>

<style scoped>
  .el-tag {
    margin-bottom: 5px;
    margin-top: 5px;
  }
</style>
