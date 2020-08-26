<template>
  <div class="position">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>职位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="职位名称" v-model="pages.searchs.positionName" clearable @clear="pagingFindAll">
            <el-button slot="append" icon="el-icon-search" @click="pagingFindAll"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">添加职位</el-button>
        </el-col>
      </el-row>
      <el-table :data="positionList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="positionName" label="职位名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="showUpdateDialog(scope.row.positionId)">
              修改
            </el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="remove(scope.row.positionId)">删除
            </el-button>
            <el-button size="mini" type="success" @click="showAllocationRightsDialog(scope.row.positionId)">分配权限
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

    <el-dialog title="添加职位" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendPositionForm')">
      <el-form label-position="right" label-width="100px" :model="appendPositionInfo" ref="appendPositionForm">
        <el-form-item label="职位名称" prop="positionName">
          <el-input v-model="appendPositionInfo.positionName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendPosition">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改职位" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updatePositionForm')">
      <el-form label-position="right" label-width="100px" :model="updatePositionInfo" ref="updatePositionForm">
        <el-form-item label="职位名称" prop="positionName">
          <el-input v-model="updatePositionInfo.positionName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updatePosition">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="allocationRightsDialogVisible" width="50%">
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="rightsId" default-expand-all
               :default-checked-keys="checkedKey" ref="treeRef" @close="allocationRightsDialogClose"></el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="allocationRightsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="allocationRights">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Position',
    data: function () {
      return {
        pages: {
          currentPage: 1,
          pageSize: 7,
          total: 0,
          lastPage: 0,
          searchs: {
            positionName: ''
          },
          flag: true
        },
        positionList: [],
        appendDialogVisible: false,
        appendPositionInfo: {
          positionName: null
        },
        updateDialogVisible: false,
        updatePositionInfo: {
          positionId: null,
          positionName: null
        },
        allocationRightsDialogVisible: false,
        treeProps: {
          children: 'children',
          label: 'rightsName'
        },
        rightsList: [],
        checkedKey: [],
        positionId: null
      }
    },
    methods: {
      pagingFindAll: async function () {
        const { data: res } = await this.$http.post('PositionController/pagingFindAll', this.pages)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.positionList = res.data.positionList
        this.pages = res.pages
      },
      appendPosition: async function () {
        const { data: res } = await this.$http.put('PositionController/append', this.appendPositionInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.appendDialogVisible = false
        this.pagingFindAll()
        this.$message.success(res.meta.msg)
      },
      showUpdateDialog: async function (positionId) {
        const { data: res } = await this.$http.get(`PositionController/findById/${positionId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updatePositionInfo = Object.assign(this.updatePositionInfo, res.data.position)
        this.updateDialogVisible = true
      },
      updatePosition: async function () {
        const { data: res } = await this.$http.put('PositionController/update', this.updatePositionInfo)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.updateDialogVisible = false
        this.pagingFindAll()
      },
      remove: async function (positionId) {
        const result = await this.$confirm('是否删除此职位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.delete(`PositionController/remove/${positionId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.pagingFindAll()
      },
      showAllocationRightsDialog: async function (positionId) {

        this.positionId = positionId

        const { data: res } = await this.$http.get('RightsController/treeFindAll')

        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.rightsList = res.data.rightsList

        const { data: r } = await this.$http.get(`RightsController/findHaveThreeRights/${positionId}`)

        if (!r.meta.access) {
          return this.$message.error(r.meta.msg)
        }

        this.checkedKey = r.data.haveThreeRights
        this.allocationRightsDialogVisible = true
      },
      allocationRightsDialogClose: function () {
        this.checkedKey = []
      },
      allocationRights: async function () {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]

        const { data: res } = await this.$http.put('RightsController/allocationRights', {
          positionId: this.positionId,
          keys: keys
        })

        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.allocationRightsDialogClose()
        this.$message.success(res.meta.msg)
        this.allocationRightsDialogVisible = false
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
