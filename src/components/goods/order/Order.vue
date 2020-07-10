<template>
  <div>
     <!-- 导航栏区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-Card>
      <el-row>
        <el-col :span='8'>
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
        </el-col>
      </el-row>
    </el-Card>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style less="less" scoped>

</style>
