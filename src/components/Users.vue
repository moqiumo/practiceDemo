<template>
    <div>
        <!-- 导航栏区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6"><el-button type="primary">添加用户</el-button></el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
    // 获取用户列表参数对象：queryInfo
      queryInfo: {
        query: '',
        pagenum: 1,
        pagessize: 2
      },
      userList: [],
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.userList
      this.total = res.data.total
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
