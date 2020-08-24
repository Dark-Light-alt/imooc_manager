<template>
    <div class="home">
      <el-container>
        <el-aside :width="aside_width">
          <el-menu router v-for="menu in menus" :key="menu.id" background-color="#304156" text-color="#BFCBD9" :collapse="collapses" :default-active="active"  @select="select">
            <el-menu-item :index="menu.id" v-if="menu.children === undefined" :route="{name: menu.path}">
              <i :class="menu.icon"></i>
              <span>{{menu.name}}</span>
            </el-menu-item>
            <el-submenu :index="menu.id" v-if="menu.children !== undefined">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{menu.name}}</span>
              </template>
              <el-menu-item :index="children.id" v-for="children in menu.children" :key="children.id" :route="{name: children.path}">
                <span>{{children.name}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header height="50px">
            <div class="header_left" @click="collapse">
              <i :class="collapse_icon"></i>
            </div>
            <div class="header_right">
              <el-avatar shape="square" :size="40" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"></el-avatar>
              <span>{{consumer.name}}</span>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="PersonalCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item command="UpdatePwd">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-header>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
export default {
  name: 'Home.vue',
  data: function () {
    return {
      active: '',
      collapses: false,
      aside_width: '210px',
      collapse_icon: 'el-icon-s-fold',
      consumer: {},
      menus: [
        {
          id: '1',
          path: '',
          name: '权限管理',
          icon: 'el-icon-menu',
          children: [
            {
              id: '1_1',
              path: 'EmployeeInfo',
              name: '员工管理'
            },
            {
              id: '1_2',
              path: 'Role',
              name: '角色管理'
            },
            {
              id: '1_3',
              path: 'Module',
              name: '模块管理'
            },
            {
              id: '1_4',
              path: 'Function',
              name: '资源管理'
            }
          ]
        }
      ]
    }
  },
  methods: {
    collapse: function () {
      if (!this.collapses) {
        this.aside_width = '64px'
        this.collapse_icon = 'el-icon-s-unfold'
      } else {
        this.aside_width = '210px'
        this.collapse_icon = 'el-icon-s-fold'
      }
      this.collapses = !this.collapses
    },
    handleCommand: function (command) {
      this.$router.push({ name: command })
    },
    select: function (index) {
      this.active = index
    },
    exit: async function () {
      const { data: res } = await this.$http.post('/logout')

      if (!res.meta.access) {
        return this.$message.error(res.meta.msg)
      }

      this.$message.success(res.meta.msg)
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
  .home,.el-container {
    height: 100%;
  }
  .el-aside {
    transition: width .28s;
    background-color: #304156;
  }
  .el-header {
    padding: 0px 20px 0px 0px;
    line-height: 50px;
  }
  .el-main {
    background-color: #eff1f4;
  }
  .el-menu {
    border: 0px !important;
  }
  div + ul > .el-menu-item {
    background-color: #1f2d3d !important;
    padding-left: 48px !important;
  }
  .el-menu :hover {
    background-color: #001528 !important;
  }
  .header_left {
    display: inline-block;
    height: 100%;
    width: 50px;
    color: #5cb6ff;
    text-align: center;
    line-height: 50px;
  }
  .el-icon-s-fold,.el-icon-s-unfold {
    font-size: 23px;
  }
  .header_left:hover {
    background-color: rgba(0, 0, 0, 0.025);
  }
  .header_right {
    width: 50%;
    height: 50px;
    display: inline-block;
    float: right;
    text-align: right;
  }
  .el-avatar {
    margin-top: 5px;
    vertical-align: center;
    border-radius: 10px;
    margin-right: 15px;
  }
</style>
