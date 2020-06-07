<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/tx.png" alt="">
                <span>电商后台管理系统管理</span>
            </div>
            <el-button type="info" @click="logout"> 退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
                <el-menu :default-openeds="['1', '3']" background-color="#333744" text-color="#fff" active-text-color="red" :unique-opened="true">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级模板区 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                         <el-menu-item-group :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                 <i class="el-icon-menu"></i>
                                 <!-- 文本 -->
                                 <span>{{subItem.authName}}</span>
                            </template>
                         </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容区 -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
  data () {
    return {
    // 菜单数据
      menuList: [
      ],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}

.el-main {
    background-color: #eaedf1;
}
.home_container {
    width: 100%;
    height: 100%;
}
.iconfont {
    margin-right: 10px;
}
</style>
