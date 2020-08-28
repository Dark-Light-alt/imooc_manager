<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" @click="appendDialogVisible = true">添加权限</el-button>
        </el-col>
      </el-row>
      <el-table :data="rightsList" row-key="rightsId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="rightsName" label="权限名称"></el-table-column>
        <el-table-column prop="rightsPath" label="权限路径"></el-table-column>
        <el-table-column prop="icon" label="前端图标">
        </el-table-column>
        <el-table-column prop="rightsLevel" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.rightsLevel == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.rightsLevel == 1">二级</el-tag>
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary"
                       @click="showUpdateDialog(scope.row.rightsId)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="remove(scope.row.rightsId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加权限" :visible.sync="appendDialogVisible" width="50%"
               @close="dialogClose('appendRightsForm')" @open="findParent">
      <el-form label-position="right" label-width="100px" :model="appendRightsInfo" ref="appendRightsForm">
        <el-form-item label="权限名称" prop="rightsName">
          <el-input v-model="appendRightsInfo.rightsName"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="rightsPath">
          <el-input v-model="appendRightsInfo.rightsPath"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="appendRightsInfo.icon"></el-input>
        </el-form-item>
        <el-form-item label="父级权限" prop="parentId">
          <el-select v-model="appendRightsInfo.parentId" placeholder="请选择">
            <el-option label="一级权限" value="0"></el-option>
            <el-option v-for="item in parentRightsList" :key="item.rightsId" :label="item.rightsName"
                       :value="item.rightsId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="appendDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="appendRights">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改权限" :visible.sync="updateDialogVisible" width="50%"
               @close="dialogClose('updateRightsForm')">
      <el-form label-position="right" label-width="100px" :model="updateRightsInfo" ref="updateRightsForm">
        <el-form-item label="权限名称" prop="rightsName">
          <el-input v-model="updateRightsInfo.rightsName"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="rightsPath">
          <el-input v-model="updateRightsInfo.rightsPath"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="updateRightsInfo.icon"></el-input>
        </el-form-item>
        <el-form-item label="父级权限" prop="parentId">
          <el-select v-model="updateRightsInfo.parentId" placeholder="请选择">
            <el-option label="一级权限" value="0"></el-option>
            <el-option v-for="item in parentRightsList" :key="item.rightsId" :label="item.rightsName"
                       :value="item.rightsId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateRights">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Rights',
    data: function () {
      return {
        rightsList: [],
        appendDialogVisible: false,
        appendRightsInfo: {
          rightsId: null,
          rightsName: null,
          rightsPath: null,
          icon: null,
          parentId: null
        },
        parentRightsList: [],
        updateDialogVisible: false,
        updateRightsInfo: {
          rightsId: null,
          rightsName: null,
          rightsPath: null,
          icon: null,
          parentId: null
        }
      }
    },
    methods: {
      treeFindAll: async function () {
        const { data: res } = await this.$http.get('RightsController/treeFindAll')
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.rightsList = res.data.rightsList
      },
      findParent: async function () {
        const { data: res } = await this.$http.get('RightsController/findParent')

        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.parentRightsList = res.data.rightsList
      },
      appendRights: async function () {
        const { data: res } = await this.$http.put('RightsController/append', this.appendRightsInfo)

        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.treeFindAll()
        this.appendDialogVisible = false
      },
      showUpdateDialog: async function (rightsId) {
        this.findParent()

        const { data: res } = await this.$http.get(`RightsController/findById/${rightsId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }
        this.updateRightsInfo = Object.assign(this.updateRightsInfo, res.data.rights)
        this.updateDialogVisible = true
      },
      updateRights: async function () {
        const { data: res } = await this.$http.put('RightsController/update', this.updateRightsInfo)

        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.treeFindAll()
        this.updateDialogVisible = false
      },
      remove: async function (rightsId) {
        const result = await this.$confirm('是否删除此权限及子孙级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result !== 'confirm') {
          return
        }

        const { data: res } = await this.$http.delete(`RightsController/remove/${rightsId}`)
        if (!res.meta.access) {
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.treeFindAll()
      },
      dialogClose: function (formRef) {
        this.$refs[formRef].resetFields()
      }
    },
    created: function () {
      this.treeFindAll()
    }
  }
</script>

<style scoped>

</style>
