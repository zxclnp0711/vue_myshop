<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数!"
                type="warning"
                :closable="false"
                show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器预留 -->
          <el-cascader :options="catelist"
                       :props="cascaderProps"
                       @change="parentCateChange"
                       v-model="selectedKeys"
                       clearable></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName"
               @tab-click="handleTabClick">
        <el-tab-pane label="动态参数"
                     name="many">
          <el-button type="primary"
                     :disabled=isBtnDisabled
                     @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData"
                    border
                    stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        closable
                        @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="editDiaglog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="editDelete(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性"
                     name="only">
          <el-button type="primary"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTableData"
                    border
                    stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        closable>{{item}}</el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="editDiaglog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="editDelete(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+ titleText"
               :visible.sync="addDialogVisible"
               width="30%"
               @close="addCloseDialog">
      <el-form :rules="addFormRules"
               :model="addForm"
               ref="addFormRef"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑参数对话框 -->
    <el-dialog :title="'编辑'+ titleText"
               :visible.sync="editDialogVisible"
               width="30%"
               @close="editCloseDialog">
      <el-form :rules="addFormRules"
               :model="editForm"
               ref="editFormRef"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      catelist: [],
      addDialogVisible: false,
      editDialogVisible: false,
      btnDisabled: false,
      activeName: 'many',
      addForm: {
        attr_name: ''
      },
      editForm: {},
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      manyTableData: [],
      onlyTableData: [],
      addFormRules: {
        attr_name: [
          {
            required: true, message: '请输入参数名称', trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getParentCateList()
  },
  methods: {
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.catelist = res.data
    },
    parentCateChange () {
      this.getParamsData()
    },
    // tab页签点击事件处理函数
    handleTabClick () {
      this.getParamsData()
    },
    async getParamsData () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addCloseDialog () {

    },
    editCloseDialog () {

    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) return this.$message.error('获取参数失败')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    async editDiaglog (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { attr_sel: this.activeName })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) return this.$message.error('更新参数失败')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    async editDelete (id) {
      console.log(this.cateId, id)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除参数失败')
        console.log(res)
        this.$message.success('已经删除成功')
        this.getParamsData()
      } catch (error) {
        this.$message.info('已经取消删除')
      }
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        this.saveAttrVals(row)
      }
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) return this.$message.error('修改参数失败')
      this.$message.success('修改参数成功')
      row.inputValue = ''
      row.inputVisible = false
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      } else {
        return null
      }
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin-right: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>
