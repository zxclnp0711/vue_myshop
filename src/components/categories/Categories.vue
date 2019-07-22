<template>
  <div class="categories">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <table-tree class="treeTable"
                  :data="catelist"
                  :columns="columns"
                  :expand-type="false"
                  :selection-type="false"
                  show-index
                  index-text="#"
                  border>
        <!-- 是否有效模版 -->
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color:lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color:red"></i>
        </template>
        <!-- 排序模版 -->
        <template slot="order"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success"
                  v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning"
                  v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="">
          <el-button icon="el-icon-edit"
                     type="primary">编辑</el-button>
          <el-button icon="el-icon-delete"
                     type="danger">删除</el-button>
        </template>
      </table-tree>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[3, 5, 10, 15]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="60%">
      <el-form :model="addCateForm"
               :rules="cateFormRules"
               ref="cateFormRef"
               label-width="100px">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader :options="parentlist"
                       :props="cascaderProps"
                       @change="parentCateChange"
                       v-model="selectedKeys"
                       clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCateList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addCateDialogVisible: false,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 级联选择器配置选项
      cascaderProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品分类数据列表，默认空
      catelist: [],
      parentlist: [],
      selectedKeys: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt',
        align: 'center'
      }],
      addCateForm: {
        cat_name: '',
        cat_id: 0,
        cat_level: 0
      },
      cateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCategories()
    this.getParentCateList()
  },
  methods: {
    async getCategories () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategories()
    },
    // 监听Pagenum改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategories()
    },
    showCateDialog () {
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.parentlist = res.data
    },
    parentCateChange () {

    },
    addCateList () {

    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>
