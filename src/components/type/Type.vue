<template>
  <div class="type">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">课程体系</el-breadcrumb-item>
      <el-breadcrumb-item>课程类别</el-breadcrumb-item>
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
      <el-table :data="typeList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="typeName" label="类别名称"></el-table-column>
        <el-table-column prop="typeIsenable" label="是否锁定">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.typeIsenable"
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
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="showUpdateDialog(scope.row.typeId)">
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

    <el-dialog title="添加课程类别" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendTypeForm')" @open="findAllDirection">
      <el-form label-position="right" label-width="100px" :model="appendTypeInfo" ref="appendTypeForm">
        <el-form-item label="类别名称" prop="typeName">
          <el-input v-model="appendTypeInfo.typeName"></el-input>
        </el-form-item>
        <el-form-item label="课程方向" prop="directionId">
          <el-select v-model="appendTypeInfo.directionId" placeholder="请选择">
            <el-option v-for="item in directionList" :key="item.directionId" :label="item.directionName"
                       :value="item.directionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="directionIsenable">
          <el-radio-group v-model="appendTypeInfo.typeIsenable">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendType">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改课程类别" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updateTypeForm')">
      <el-form label-position="right" label-width="100px" :model="updateTypeInfo" ref="updateTypeForm">
        <el-form-item label="类别名称" prop="typeName">
          <el-input v-model="updateTypeInfo.typeName"></el-input>
        </el-form-item>
        <el-form-item label="课程方向" prop="directionId">
          <el-select v-model="updateTypeInfo.directionId" placeholder="请选择">
            <el-option v-for="item in directionList" :key="item.directionId" :label="item.directionName"
                       :value="item.directionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="directionIsenable">
          <el-radio-group v-model="updateTypeInfo.typeIsenable">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="udateType">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'Type',
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
        typeList: [],
        appendDialogVisible: false,
        appendTypeInfo: {
          typeName: null,
          directionId: null,
          typeIsenable: 0
        },
        updateDialogVisible: false,
        updateTypeInfo: {
          typeId: null,
          typeName: null,
          directionId: null,
          typeIsenable: null
        },
        directionList: []
      }
    },
    methods: {
      pagingFindAll: async function () {
        const { data: res } = await this.$http.post('TypeController/pagingFindAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.typeList = res.data.typeList
        this.pages = res.pages
      },
      findAllDirection: async function () {
        const { data: res } = await this.$http.get('DirectionController/findAll')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.directionList = res.data.directionList
      },
      appendType: async function () {
        const { data: res } = await this.$http.put('TypeController/append', this.appendTypeInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.appendDialogVisible = false
        this.pagingFindAll()
      },
      showUpdateDialog: async function (typeId) {
        const { data: res } = await this.$http.get(`TypeController/findById/${typeId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateTypeInfo = res.data.type
        this.findAllDirection()
        this.updateDialogVisible = true
      },
      udateType: async function (){
        const { data: res } = await this.$http.put('TypeController/update', this.updateTypeInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.updateDialogVisible = false
        this.pagingFindAll()
      },
      changeEnable: async function (row) {
        const { data: res } = await this.$http.get(`TypeController/changeEnable/${row.typeId}/${row.typeIsenable}`)
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

</style>
