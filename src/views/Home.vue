<template>
  <div class="home">
    <el-container class="home-container">
      <el-header class="el-header">
        <div>
          <img src="../assets/logo.png"
               alt="">
          <span>MyShop后台管理系统</span>
        </div>
        <el-button type="info"
                   @click="logout">
          退出
        </el-button>
      </el-header>
      <el-container>
        <!-- 根据isCollapse的布尔值来设置aside的宽度 -->
        <el-aside :width="isCollapse ? '64px':'200px'"
                  class="el-aside">
          <div class="toggle-button"
               @click="toggleCollapse">|||</div>
          <el-menu background-color="#616161"
                   text-color="#fff"
                   active-text-color="#0091EA"
                   unique-opened
                   :collapse="isCollapse"
                   :collapse-transition="false">
            <!-- 一级菜单 -->
            <el-submenu :index="menulist.id + ''"
                        v-for="menulist in menulists"
                        :key="menulist.id">
              <template slot="title">
                <i :class="iconsObj[menulist.id]"
                   class="icons"></i>
                <span>{{menulist.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="subMenulist.id+''"
                            v-for="subMenulist in menulist.children"
                            :key="subMenulist.id">
                <i class="el-icon-menu icons"></i>
                <span>{{subMenulist.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="el-main">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menulists: [],
      iconsObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-suitcase-1',
        '101': 'el-icon-shopping-bag-1',
        '102': 'el-icon-document',
        '145': 'el-icon-pie-chart'
      },
      // 是否折叠
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulists = res.data
      // console.log(this.menulists)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang='less' scoped>
.home {
  height: 100%;
  .home-container {
    height: 100%;
    .el-header {
      background-color: #212121;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        height: 100%;
        display: flex;
        align-items: center;
        color: #eee;
        justify-content: space-between;
        img {
          height: 80%;
        }
        span {
          font-size: 20px;
        }
      }
    }
    .el-aside {
      background-color: #616161;
      .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.3em;
        cursor: pointer;
      }
      .icons {
        margin-right: 10px;
        font-size: 18px;
      }
      .el-menu {
        border-right: none;
      }
    }
    .el-main {
      background-color: #eeeeee;
    }
  }
}
</style>
