<template>
  <div id="home">
    <el-container class="home-container">
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="~assets/img/avatar_box.jpg" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 主体 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '84px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            :default-active="activePathValue"
            :collapse="isCollapse"
            :collapse-transition="false"
            unique-opened
            router
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
          >
            <!-- 一级菜单 -->
            <!-- index只接收字符串 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <!-- 一级菜单模板 -->
              <template #title>
                <i :class="icons[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <!-- element-ui组件库中的menu的router开启后 可以将index中的值作为路径进行跳转 -->
              <el-menu-item
                @click="saveNavStatus('/' + subItem.path)"
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <!-- 二级菜单模板 -->
                <template #title>
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      icons: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
      isCollapse: false,
      activePathValue: "",
    };
  },
  created() {
    this.getMenuList();
    //当组件被创建的时候就获取到sessionStorage里的activePath值
    this.activePathValue = window.sessionStorage.getItem("activePath");
  },
  methods: {
    //退出登录
    logout() {
      //清空sessionStorage的token
      window.sessionStorage.clear("token");
      //跳转到登录界面
      this.$router.push("/login");
    },
    //获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.mate.msg);
      this.menuList = res.data;
    },
    //切换菜单的折叠展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存链接的激活状态
    saveNavStatus(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePathValue = activePath;
    },
  },
};
</script>
<style lang="less" scoped>
#home,
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  background-color: #373D41;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}

.el-aside {
  overflow: hidden;
  background-color: #333744;
}

.el-main {
  background-color: #EAEDF1;
}

.el-menu {
  border-right: none;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 14px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
}
.toggle-button:hover {
  cursor: pointer;
  color: #409EFF;
}
</style>