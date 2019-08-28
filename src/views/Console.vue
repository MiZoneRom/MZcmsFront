<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>卡片名称</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <div v-for="o in 100" :key="o" class="text item">{{'列表内容 ' + o }}</div>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      username: ""
    };
  },
  methods: {},
  created() {
    this.username = JSON.parse(sessionStorage.getItem("admin"));
  }
};
</script>
<style lang='less' scoped>
</style>