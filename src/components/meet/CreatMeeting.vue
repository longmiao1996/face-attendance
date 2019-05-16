<template>
    <el-container style="height: 100%;">
      <el-header style="height: 55px;">
        <div class="title_back">
          <span>会议名</span>
          <el-input v-model="meetingName"
                    placeholder="请输入内容"
                    class="title_input"
                    size="medium"> </el-input>
        </div>
      </el-header>
      <el-container class="container_back">
        <el-aside width="160px" class="content_back">
          <div >
            <h4>会议内容</h4>
            <el-input v-model="meetingContent"
                      type="textarea"
                      placeholder="请输入内容"
                      class="content_input"
                      size="medium"
                      :rows="10">
            </el-input>
          </div>
        </el-aside>
        <el-container>
          <el-main class="pic_div">
            <ul class="pic_ul" v-for="item in staffList">
              <li class="pic_li">
                <button class="b_delete" @click="deletePerson(item.number)">
                  <span class="glyphicon glyphicon-remove-sign"></span>
                </button>
                <div class="pic_back_circle">
                  <div class="pic_circle">
                    <!--<img :src="item.image" class="img-circle pic_img" />-->
                    <img :src="'data:image/jpeg;base64,'+item.image" class="img-circle pic_img" />

                  </div>
                </div>
                <div class="pic_mes">
                  <span class="pic_span1">{{item.number}}</span>
                  <span class="pic_span2">{{item.name}}</span>
                </div>
              </li>
            </ul>
          </el-main>
          <el-footer>
            <div class="btn_tools">
              <el-button type="danger" @click="handleAddPerson">人员选取</el-button>
              <el-button type="danger" @click="startToSign">开始签到</el-button>
            </div>
          </el-footer>

          <!-- 人员添加Dialog -->
          <el-dialog
            title="会议人员添加"
            :visible.sync="showTransfer"
            width="550px">
            <el-transfer v-model="meetingPersonList"
                         :data="personList"
                         :titles="['公司员工', '参与会议人员']"
                         @change="handleTransferChange">
            </el-transfer>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showTransfer = false">取 消</el-button>
              <el-button type="danger" @click="addPerson(meetingPersonList)">确 定</el-button>
            </span>
          </el-dialog>

        </el-container>
      </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "CreatMeeting",
        data() {
          return {
            meetingName:'',
            meetingContent:'',
            // 面板中参与会议的人员名单
            staffList:[],
            personList:[ ],
            showTransfer: false,
            meetingPersonList:[
            ],
          }
        },
        methods:{
          loadPersonList() {
            this.$axios.post('options')
              .then((res) => {
                if(res.data.user_op.length!==0 ) {
                  res.data.user_op.forEach((item ) => {
                    item.number = item.id+""
                    item.key = item.number;
                    item.label = item.name;
                  })
                }
                this.personList = res.data.user_op;
              })
          },
          deletePerson(value) {
            for (let i = 0; i < this.staffList.length; i++) {
              if(this.staffList[i].number === value) {
                // this.staffList.splice(i, 1);
                this.meetingPersonList.splice(i, 1);
                if(this.meetingPersonList.length !== 0) {
                  this.addPerson(this.meetingPersonList);
                }
                break;
              }
            }
          },
          addPerson(meetingPersonList) {
            this.staffList = [];
            let meetingPersonString = '';
            if(meetingPersonList.length !== 0) {
              meetingPersonList.forEach((item) => {
                meetingPersonString = meetingPersonString+ item +','
              })
            }
            meetingPersonString = meetingPersonString.substring(0,meetingPersonString.length-1);
            this.showTransfer = false;

            this.$axios.post('/options_ok',
              this.qs.stringify({
                options: meetingPersonString
              }))
              .then((res) => {
                this.staffList = res.data.user_opok;
                if(this.staffList.length !== 0) {
                  this.staffList.forEach((item) => {
                    item.number = item.id + ''
                  })
                }
                this.showTransfer = false;
              })
          },
          handleAddPerson() {
            this.loadPersonList()
            this.showTransfer = true;
          },
          handleTransferChange() {
            // console.log(this.meetingPersonList)
            // console.log(this.personList)
          },
          startToSign() {
            let meetingPersonString = '';
            if(this.meetingPersonList.length === 0) {
              this.$message({
                type:'warning',
                message:'请选择参与会议的人员'
              })
              return
            }
            if(this.meetingPersonList.length !== 0) {
              this.meetingPersonList.forEach((item) => {
                meetingPersonString = meetingPersonString+ item +','
              })
            }
            meetingPersonString = meetingPersonString.substring(0,meetingPersonString.length-1);
            this.$axios.post('/addMeeting',
              this.qs.stringify({
              name_m : this.meetingName,
              content_m : this.meetingContent,
              ids_m:meetingPersonString,
                state:1
            }))
              .then(() => {
                this.$emit('changeState',1);
              })
          },
        },
        mounted() {

        }
    }
</script>

<style scoped>
 .title_back {
   background: rgba(255, 0, 0, 0.7);
   color: white;
   border-top-left-radius: 10px;
   border-top-right-radius: 10px;
   padding: 10px;
   text-align: center;
 }
  .title_input {
    width: 45%;
    margin-left: 10px;
  }
  .container_back {
    border-left: rgba(255, 0, 0, 0.4) 1px solid;
    border-right: rgba(255, 0, 0, 0.4) 1px solid;
    height: 100%;
    margin: 0 20px;
  }
  .content_back {
    padding: 10px;
    margin-left: 20px;
    border-right: rgba(255, 0, 0, 0.4) 1px solid;
  }
  .content_input {
    margin-top: 30px;
    width: 90%;
  }

 .pic_ul {
   display: inline-flex;
 }
 .pic_li {
   list-style: none;
   box-shadow: 0 0 1px #FF8C80;

 }
 .pic_li:hover {
   transform: scale(1.1);
   box-shadow: 0 0 25px #FF8C80;
 }
 .pic_back_circle {
   width: 120px;
   height: 140px;
   padding-top: 29px;
   background: rgba(255, 73, 55, 0.70);
 }
 .pic_circle {
   width: 100px;
   height: 100px;
   margin-left: 10px;
   border: #FFFFFF 1px dotted;
   border-radius: 100px;
 }
 .pic_img {
   margin-left: 2px;
   width: 94px;
   height: 94px;
 }
 .pic_mes {
   width: 100px;
   height: 80px;
 }
 .pic_span1 {
   width: 120px;
   height: 40px;
   background: #FFFFFF;
   display: block;
   text-align: center;
   line-height: 40px;
   color: #515A60;
   font-weight: bolder;
   font-size: 26px;
 }

 .pic_span2 {
   width: 120px;
   height: 40px;
   background: #FFFFFF;
   display: block;
   text-align: center;
   line-height: 40px;
   color: #4F585E;
   font-size: 18px;
 }

 .b_delete {
   background-color: rgba(255, 255, 255, 0);
   border: rgba(255, 73, 55, 0) 1px solid;
   color: white;
   text-align: center;
   text-decoration: none;
   display: inline-block;
   font-size: 20px;
   border-radius: 20px;
   margin-left: 65px;
   float: right;
 }

 .b_delete:active {
   transform: scale(0.95);
   box-shadow: 0 0 25px #FF8C80;
 }

  .btn_tools {
    float: right;
    line-height: 80px;
  }
</style>
