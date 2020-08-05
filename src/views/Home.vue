<template>
  <el-row class="container">
    <el-col class="main" :span="24">
      <aside :class="isCollapse?'menu-collapsed':'menu-expanded'">
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <template v-for="(item , index) in route" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.name}}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.path"
                :index="child.path"
                v-if="!child.hidden"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <!-- 叶子结点 -->
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
              <i :class="item.iconCls"></i>
              {{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <section class="content-container">
        <div class="header">
          <el-menu class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="collapse">
              <i class="el-icon-setting"></i>
            </el-menu-item>
            <el-menu-item index="2">消息中心</el-menu-item>
            <el-submenu index="3">
              <template slot="title">
                <el-avatar icon="el-icon-user-solid" :src="avatarUrl"></el-avatar>
                {{username}}
              </template>
              <el-menu-item index="3-1" @click.native="$router.push('/profile')">个人主页</el-menu-item>
              <el-menu-item index="3-2" @click.native="logout">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>

        <div class="content">
          <el-scrollbar>
            <div class="content-wrapper">
              <div class="breadcrumb-container">
                <strong class="title">{{$route.name}}</strong>
                <el-breadcrumb
                  separator-class="el-icon-arrow-right"
                  class="breadcrumb-inner"
                  v-if="$route.matched[0].name!=''"
                >
                  <el-breadcrumb-item
                    v-for="item in $route.matched"
                    :key="item.path"
                    :to="{path: item.path==''?'/':item.path}"
                  >{{ item.name }}</el-breadcrumb-item>
                </el-breadcrumb>
              </div>

              <div class="router-wrapper">
                <transition name="fade" mode="out-in">
                  <router-view></router-view>
                </transition>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script type="text/javascript">
import apiPath from "@/service/apiPath";
export default {
  data() {
    return {
      isCollapse: false,
      username: "-",
      avatarUrl: "",
      route: global.antRouter
    };
  },
  methods: {
    // collapse banner
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen() {
      console.log("handleopen");
    },
    handleClose() {
      console.log("handleclose");
    },
    handleselect() {
      console.log("handleselect");
    },
    showMenu(i, status) {
      console.log(i);
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
    logout() {
      let vm = this;
      vm.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("admin");
          vm.$router.push({ path: "/login" });
        })
        .catch(() => {
          console.log("error");
        });
    }
  },
  created() {
    let vm = this;
    console.info(this.route);
    vm.$fetch(apiPath.USER_INFO).then(data => {
      vm.username = data.managerModel.realName;
      vm.avatarUrl =
        data.managerModel.avatar == null
          ? ""
          : data.managerModel.avatar;
    });
  },
  computed: {}
};
</script>
<style lang="less" scoped>
@import "../styles/public.less";
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  .main {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    aside {
      flex: 0 0 230px;
      width: 230px;
      transition: 0.3s ease-in-out;
      .el-menu {
        width: 100%;
        height: 100%;
        background: #eef1f6;
      }
      &.menu-collapsed {
        flex: 0 0 60px;
      }
    }
    .el-menu-vertical-demo.el-menu--collapse {
      width: 60px;
      min-height: 400px;
    }
    .content-container {
      flex: 1;
      position: relative;
    }
    .content {
      display: flex;
      position: absolute;
      top: 61px;
      bottom: 0;
      left: 0;
      right: 0;
      .el-scrollbar__wrap{
        overflow: auto;
      }
      .el-scrollbar {
        width: 100%;
      }
      .content-wrapper {
        flex: 1;
        padding: 10px;
        .breadcrumb-container {
          padding: 10px;
          .title {
            max-width: 300px;
            font-size: 18px;
            float: left;
          }
          .breadcrumb-inner {
            float: right;
          }
          .content-wrapper {
            background-color: #fff;
            box-sizing: border-box;
          }
        }
        .router-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>