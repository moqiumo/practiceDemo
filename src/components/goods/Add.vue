<template>
  <div>
     <!-- 导航栏区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-Card>
      <!-- 提示区域 -->
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false">
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs :tab-position="'left'" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">定时任务补偿</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-Card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单对象
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', tigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', tigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', tigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', tigger: 'blur' }
        ]
      },
      cateList: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    }
  }
}
</script>
<style less="less" scoped>
</style>
