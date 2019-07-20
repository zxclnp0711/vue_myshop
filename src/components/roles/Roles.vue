<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList"
                border
                stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, index1) in scope.row.children"
                    :key="item1.id"
                    :class="['bdbottom', index1===0?'bdtop':'','vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="deleteRolesById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '':'bdtop','vcenter']"
                        v-for="(item2,index2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="deleteRolesById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children"
                            :key="item3.id"
                            type="warning"
                            closable
                            @close="deleteRolesById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column type="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column type="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column type="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       @click="removeRolesById(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       @click="showSetRolesDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限"
               :visible.sync="setRolesDialogVisible"
               width="30%"
               @close="setRolesDialogClosed">
      <el-tree :data="rolesListTree"
               :props="treeProps"
               show-checkbox
               node-key="id"
               :default-expand-all="true"
               :default-checked-keys="defaultKeys"
               ref="treeRef"></el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗 -->
    <el-dialog title="编辑角色"
               :visible.sync="editRolesDialogVisible"
               width="60%">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRolesList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色弹窗 -->
    <el-dialog title="添加角色"
               :visible.sync="addRolesDialogVisible"
               width="60%">
      <el-form :model="addForm"
               :rules="editFormRules"
               ref="addFormRef"
               label-width="100px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRolesList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      rolesListTree: {},
      editForm: {},
      defaultKeys: [],
      roleId: '',
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      setRolesDialogVisible: false,
      editRolesDialogVisible: false,
      addRolesDialogVisible: false,
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      editFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '角色名称的长度在2~10个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '角色描述的长度在3~10个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rolesList = res.data
    },
    async deleteRolesById (role, id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
        if (res.meta.status !== 200) return this.$message.error('取消权限失败')
        this.$message.success('取消权限成功')
        role.children = res.data
      } catch {
        this.$message.info('取消了删除')
      }
    },
    async showSetRolesDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.getLeafKeys(role, this.defaultKeys)
      this.rolesListTree = res.data
      this.setRolesDialogVisible = true
    },
    // 添加角色弹窗
    async showAddDialog () {
      this.addRolesDialogVisible = true
    },
    // 添加角色
    addRolesList () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addRolesDialogVisible = false
        this.getRolesList()
      })
    },
    // 编辑角色弹窗
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.editForm = res.data
      this.editRolesDialogVisible = true
    },
    // 编辑角色
    editRolesList () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.$message.success('编辑成功')
        this.editRolesDialogVisible = false
        this.getRolesList()
      })
    },
    // 删除角色
    async removeRolesById (id) {
      try {
        await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getRolesList()
      } catch (error) {
        this.$message.info('已经取消删除')
      }
    },
    // 递归获取key
    getLeafKeys (node, arr) {
      // 遍历如果这个节点没有chidren属性，则把id传入数组
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归遍历
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRolesDialogClosed () {
      this.defaultKeys = []
    },
    // 点击为角色分配权限
    async allotRoles () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
      this.setRolesDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  .el-tag {
    font-size: 14px;
    margin: 9px;
  }
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
