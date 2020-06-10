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
            <!-- 用户列表区域 -->
            <el-table
              :data="userList"
              border
              style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="mobile" label="电话"></el-table-column>
              <el-table-column prop="role_name" label="角色"></el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.mg_state" active-color="#13ce66" @change="userStateChange(scope.row)">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="">
                  <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                      <el-button type="warning" size="mini" icon="el-icon-star-off"></el-button>
                    </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
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
        pagesize: 2
      },
      total: 5,
      userList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getUserList()
    },
    // 监听switch状态开关的改变
    async userStateChange(userInfo) {
      console.log(userInfo)
      console.log(typeof userInfo.id)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('用户状态更新成功!')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
