<template>
  <el-row class="container">
    <el-col class="main" :span="24">
      <div class="header">
        <el-menu class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1" @click="collapse" class="logo">
            <img src="/static/logo.png" />
            MCS
          </el-menu-item>
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

      <section class="content-container">
        <aside :class="isCollapse?'menu-collapsed':'menu-expanded'">
          <el-menu
            default-active="1-4-1"
            class="el-menu-vertical"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            background-color="#ffffff"
            text-color="#505050"
            active-text-color="#0081ff"
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
                  @click="$router.push(child.path)"
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

        <div class="content-body">
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
      route: global.antRouter,
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
        type: "warning",
      })
        .then(() => {
          sessionStorage.removeItem("admin");
          vm.$router.push({ path: "/login" });
        })
        .catch(() => {
          console.log("error");
        });
    },
  },
  created() {
    let vm = this;
    console.info(this.route);
    vm.$fetch(apiPath.USER_INFO).then((data) => {
      vm.username = data.managerModel.realName;
      vm.avatarUrl =
        data.managerModel.avatar == null ? "" : data.managerModel.avatar;
    });
  },
  computed: {},
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

    .header {
      display: flex;
      position: fixed;
      right: 0;
      left: 0;
      top: 0;
      box-shadow: 0px 5px 10px -10px rgba(0, 0, 0, 0.4);
      z-index: 1;
      .logo {
        width: 250px;
        img {
          height: 100%;
          width: auto;
        }
      }
      .el-menu-demo {
        width: 100%;
      }
    }

    .content-container {
      flex: 1;
      display: flex;

      aside {
        width: 320px;
        position: fixed;
        left: 0;
        bottom: 0;
        top: 60px;
        box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
        .el-menu-vertical {
          height: 100%;
        }
      }

      .content-body {
        width: 0;
        -webkit-box-flex: 1;
        flex: 1;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;

        .content {
          -webkit-box-flex: 1;
          flex: 1;
          padding: 30px;
          padding-top: 105px;
          padding-left: 350px;
          padding-bottom: 0;

          .el-scrollbar__wrap {
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
  }
}
</style>