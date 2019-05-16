<template>
  <el-container class="height_style">
    <el-header class="header_back">
      <p class="header_p">
        会议签到管理系统
      </p>
    </el-header>
    <el-container class="height_style">
      <el-aside width="10%" class="aside_back"></el-aside>

      <el-main >
        <router-view></router-view>
      </el-main>

      <el-aside width="10%" class="aside_back">
        <div class="btn_tools">
          <el-tooltip class="item" effect="light" content="会议管理" placement="left">
            <el-button type="primary"
                       icon="el-icon-date"
                       class="btn_style"
                       @click="pageJump('meeting')">

            </el-button>
          </el-tooltip>
          <div class="clear"> </div>
          <el-tooltip class="item" effect="light" content="人员管理" placement="left">
            <el-button type="primary"
                       icon="el-icon-phone"
                       class="btn_style"
                       @click="pageJump('person')">

            </el-button>
          </el-tooltip>
        </div>
      </el-aside>

    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'HomePage',
  data () {
    return {

    }
  },
  methods: {
    pageJump(page) {
      this.$router.push('/' + page)
    }
  },
  mounted() {

    // $.ajax({
    //   url:'http://192.168.43.42:8080/springBoot/addUser_p',
    //   dataType: 'json',
    //   data:{id:111,name:'tests'},
    //   success:function (res) {
    //     console.log(res)
    //   }
    // } )

    // this.$axios.post('/addUser_p',
    //   this.qs.stringify({
    //     id: 9,
    //     name:'sss',
    //     image:''
    //   }))
    //   .then(res => {
    //     console.log(res)
    //   })
  }
}
</script>

<style scoped>
  .clear {
    height: 30px;
  }
  .height_style {
    height: 100%;
  }
  .header_back{
    background: rgba(255, 0, 0, 0.8);
    color: white;
  }
  .header_p {
    margin-left: 7%;
    font-size: 18px;
    line-height: 60px;
  }
  .aside_back {
    background: rgba(255, 0, 0, 0.05);
  }
  .btn_tools {
    float: right;
    margin-right: 30px;
    margin-top: 50px;
  }
  .btn_style {
    background: rgba(255, 0, 0, 0.8);
    border-radius: 180px;
    height: 60px;
    font-size: 18px;
    border-color: white;
  }
  .btn_style:hover {
    background: rgba(255, 0, 0, 0.6);
  }
</style>
