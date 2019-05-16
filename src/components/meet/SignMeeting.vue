<template>
  <el-container style="height: 100%;">
    <el-header style="height: 40px;">
      <div class="title_back">
        <p class="title_input">
          {{ meetingName }}
        </p>
      </div>
    </el-header>
    <el-container class="container_back">
      <el-aside width="160px" class="content_back">
        <div >
          <h4>会议内容</h4>
          <p  class="content_input">
            {{ meetingContent }}
          </p>
        </div>
      </el-aside>
      <el-container>
        <el-main class="staff_box">

          <!-- 与会人员列表 -->
          <div>
            <h4>与会人员</h4>
            <ul class="pic_ul" v-for="item in staffList">
              <li class="pic_li">
                <div class="pic_back_circle">
                  <div class="pic_circle">
                    <img v-show="item.nowImage" :src="item.nowImage"  class="img-circle pic_img" />
                    <img v-show="!item.nowImage"  src="../../assets/default.jpg" class="img-circle pic_img"/>
                  </div>
                </div>
                <div class="pic_mes">
                  <span class="pic_span1">{{item.number}}</span>
                  <span class="pic_span2">{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>
          <!-- 访客列表 -->
          <div>
            <h4>访客</h4>
            <ul class="pic_ul" v-for="item in visitorList">
              <li class="pic_li">
                <div class="pic_back_circle">
                  <div class="pic_circle">
                    <img :src="item.image" class="img-circle pic_img" />
                  </div>
                </div>
                <div class="pic_mes">
                  <span class="pic_span1">{{item.number}}</span>
                  <span class="pic_span2">{{item.name}}</span>
                </div>
              </li>
            </ul>
          </div>

        </el-main>
        <el-aside width="350px" class="sign_box">
          <el-form :model="personForm">
            <el-form-item >
              <div class="video_style">
                <video v-show="showCameraOrPic === 'camera'"
                       id="video"
                       width="200px"
                       height="200px"
                       muted="false"
                       autoplay="autoplay">
                </video>
                <canvas v-show="showCameraOrPic === 'pic'"
                        id="canvas"
                        width="200px"
                        height="200px">
                </canvas>
                <div></div>
                <el-button type="danger" @click="takePhoto">拍照</el-button>
              </div>
            </el-form-item>
            <el-form-item label="姓名" >
              <el-input v-model="personForm.name"
                        autocomplete="off"
                        style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="工号" >
              <el-input v-model="personForm.number"
                        autocomplete="off"
                        style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item class="sign_back">
              <el-button type="danger" @click="signIn">签到</el-button>
            </el-form-item>
          </el-form>

          <el-button class="begin_meeting" @click="endMeeting"> 签到截止 </el-button>
        </el-aside>

        <!-- 显示签到情况的Dialog -->
        <el-dialog title="签到出勤情况"
                   :visible.sync="showSignInfo"
                   width="300px"
                   :close-on-click-modal=false
                   :close-on-press-escape=false
                  @close="jumpToCreate">
          <div class="sign_info">
            <p>应到：{{signInfo.planNumber}} 人</p>
            <p>实到：{{signInfo.realNumber}} 人</p>
            <p>访客：{{signInfo.visitNumber}} 人</p>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="jumpToCreate">确 定</el-button>
          </div>
        </el-dialog>

      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "SignMeeting",
    data() {
      return {
        meetingID:-1,
        meetingName:'Fujitsu新人教育演戏布置',
        meetingContent:'balabalabalabalabalabalabalabalabalabalabalabalabalabala',
        // 面板中参与会议的人员名单
        staffList:[],
        visitorList:[ ],
        personForm:{
          name:'',
          number:''
        },
        showCameraOrPic:'camera',
        mediaStream:'',
        signInImage:'',
        showSignInfo:false,
        signInfo:{
          planNumber:-1,
          realNumber:-1,
          visitNumber:-1,
        }
      }
    },
    methods:{
      jumpToCreate() {
        this.$emit('changeState',0);
      },
      loadMedia() {
        let constraints = {
          video: {width: 500, height: 500},
          audio: true
        };
        let video = document.getElementById("video");
        let promise = navigator.mediaDevices.getUserMedia(constraints);
        promise.then((MediaStream) =>{
          this.mediaStream = MediaStream;
          video.srcObject = MediaStream;
          video.play();
        });
      },
      closeCamera() {
        this.mediaStream.getTracks()[0].stop();
        this.mediaStream.getTracks()[1].stop();
        this.mediaStream = '';
      },
      reloadMedia() {
        this.signInImage = '';
        setTimeout(() => {
          this.showCameraOrPic = 'camera';
          this.personForm.name = '';
          this.personForm.number = '';
        }, 2000)
      },
      loadStaffList() {
        this.$axios.post('/sign')
          .then((res) => {
            this.staffList = res.data.user_m;
            if( this.staffList.length!==0 ) {
              this.staffList.forEach((item) => {
                item.number = item.id
              })
            }
            this.meetingName = res.data.name_m;
            this.meetingContent = res.data.content_m;
            this.meetingID = res.data.id_m;
          })
      },
      photoMatch(image) {
        image = image.split(',')[1];
        this.$axios.post('/match',
          this.qs.stringify({
            image_p:image,
            id:1
          }))
          .then((res) => {
            if(res.data.flag === true) {
              if(this.staffList.length!==0) {
                this.staffList.forEach((item) => {
                  if(item.number === res.data.id) {
                                item.nowImage ='data:image/jpeg;base64,'+ res.data.image1;
                    this.personForm.number = res.data.id;
                    this.personForm.name = res.data.name;
                    this.$message({
                      type:'success',
                      message:'签到成功'
                    });
                    this.reloadMedia()
                  }
                })
              }

            }
            else {
              this.$message({
                type: 'warning',
                message: '识别失败，请手动签到',
              })
            }
          })
      },
      takePhoto() {
        this.personForm.name = '';
        this.personForm.number = '';
        this.signInImage = '';
        this.showCameraOrPic = 'pic';

        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 200, 200);

        let image = canvas.toDataURL('image/png');
        this.signInImage = image;
        this.photoMatch(image)
      },
      signIn() {
        if(this.signInImage === '') {
          this.$message({
            type: 'warning',
            message: '请先拍摄照片',
          });
          return
        }
        if(this.personForm.name==='' && this.personForm.number === '') {
          this.$message({
            type: 'warning',
            message: '姓名与工号输入不可同时为空',
          });
          return
        }
        let personId = this.personForm.number;
        if(this.personForm.number === '') {
          personId = null
        }
        this.$axios.post('/upload_p',
          this.qs.stringify(
            {
              name: this.personForm.name,
              id: personId,
              image_p: this.signInImage,
            }
          ))
          .then((res) => {
            if(res.data.state === false) {
              // 访客
              this.visitorList.push({
                name: res.data.name,
                number: null,
                image: res.data.image1,
              });
              this.$message({
                type:'success',
                message:'欢迎'+ res.data.name+'来访',
              })
              this.reloadMedia()
            } else {
              if(res.data.state_id === true) {
                // 员工签到成功
                if(this.staffList.length !== 0) {
                  this.staffList.forEach((item) => {
                    if(item.number === res.data.id) {
                      item.nowImage =  res.data.image1;
                      this.personForm.number = res.data.id;
                      this.personForm.name = res.data.name;
                      this.$message({
                        type:'success',
                        message:'签到成功'
                      })
                      this.reloadMedia()
                    }
                  })
                }

              } else {
                this.$message({
                  type:'error',
                  message:'请输入正确的员工编号'
                })
              }
            }
          })
      },
      endMeeting() {
        this.$axios.post('/sign_over',
          this.qs.stringify({
            id_m:this.meetingID
          }))
          .then(() => {
            this.closeCamera();
            let realCount = 0;

            this.signInfo.planNumber = this.staffList.length;
            if(this.staffList.length !== 0) {
              this.staffList.forEach((item) => {
                if(item.nowImage) {
                  realCount ++;
                }
              })
            }
            this.signInfo.realNumber = realCount;
            this.signInfo.visitNumber = this.visitorList.length;
            this.showSignInfo = true;
          })
      }
    },
    mounted() {
      this.loadMedia();
      this.loadStaffList();
    },

  }
</script>

<style scoped>
  .title_back {
    background: rgba(255, 0, 0, 0.7);
    color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-align: center;
  }
  .title_input {
    line-height: 40px;
    height: 40px;
    font-size: 20px;
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
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
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
    height: 120px;
    padding-top: 13px;
    background: rgba(255, 73, 55, 0.70);
  }
  .pic_circle {
    width: 100px;
    height: 100px;
    margin-left: 10px;
    border: #FFFFFF 1px dotted;
    border-radius: 100px;
  }
  .img_icon {
    color: white;
    font-size: 100px;
    text-align: center;
    font-weight: 100;
    margin-top: -22px;
  }
  .pic_img {
    margin-left: 2px;
    margin-top: 2px;
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

  .staff_box::-webkit-scrollbar {
    display: none;
  }

  .video_style {
    text-align: center;
    margin-top: 50px;
  }

  .sign_back {
    text-align: center;
  }
  .sign_back button {
    width: 120px;
  }
  .sign_box {
    position: relative;
    border-left: 1px dashed rgba(255, 0, 0, 0.41);
    padding-left: 30px;
  }
  .begin_meeting {
    width: 70%;
    margin-left: 15%;
    margin-top: 40px;
    border: rgba(255, 0, 0, 0.66) solid 1px;
  }
  .begin_meeting:hover {
    background: rgba(255, 0, 0, 0.20);
    color: rgba(0, 0, 0, 0.7);
  }
  .sign_info {
    text-align: center;
    font-size: 20px;
  }

</style>
