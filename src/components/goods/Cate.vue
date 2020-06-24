<template>
    <div>
        <!-- 导航栏区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns"
            :selection-type="false" :expand-type="false"
            show-index index-text="#" border>
            <!-- 是否有效 -->
              <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
                style="color: lightgreen;"></i>
                <i class="el-icon-error" v-else style="color: lightgreen;"></i>
              </template>
              <template slot="order" slot-scope="scope">
                <!-- 排序列 -->
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
              </template>
              <template slot="opt" slot-scope="">
                <!-- 操作 -->
               <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 14]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>

        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addCateDialogvisible"
          width="40%" @close="addCateDialogClosed">
          <!-- 添加分类的表单 -->
          <el-form :model="addCateForm" :rules="addCateFormRules"
          ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <!-- options指定数据源 -->
            <el-form-item label="父级分类">
              <el-cascader v-model="selectedKeys"
              :options="parentCateList"
              expand-trigger="hover" clearable change-on-select="true"
              :props="cascaderProps"
              @change="parentCateChange">
              </el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogvisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
  data() {
    return {
    // 商品列表对象
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 定义当前的模板列
        type: 'template',
        // 当前模板的名称
        template: 'isok'
      }, {
        label: '排序',
        // 定义当前的模板列
        type: 'template',
        // 当前模板的名称
        template: 'order'
      }, {
        label: '操作',
        // 定义当前的模板列
        type: 'template',
        // 当前模板的名称
        template: 'opt'
      }
      ],
      // 添加分类弹窗控制
      addCateDialogvisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 验证表单的规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 指定联级的对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败！')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加分类
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogvisible = true
    },
    // 获取所有的2层分类(父级分类的列表)
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项变化触发的函数
    parentCateChange() {
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0，说明选中了父级分类
      // 反之，就没选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.addCateDialogvisible = false
        this.getCateList()
      })
    },
    // 监听对话框的关闭事件，重置表单的数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
