<template>
    <div>
      <el-table
        :data="personList"
        class="list_style"
        height="650">
        <el-table-column
          type="index"
          width="120"
          align="center">
          <template slot="header" >
            <el-button type="danger"
                       icon="el-icon-plus"
                       size="medium"
                       @click="handleAdd">
              新建
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="照片" align="center">
          <template slot-scope="scope">
            <img :src="'data:image/jpeg;base64,'+scope.row.image" class="table_img"/>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="工号" align="center">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <!--<el-button-->
              <!--size="mini"-->
              <!--@click="handleEdit(scope.row)">编辑</el-button>-->
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.number)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加或修改人员信息的dialog -->
      <el-dialog :title="'人员信息'+addOrEditString"
                 :visible.sync="showPersonFormDialog"
                  width="40%">

        <el-form :model="personForm" v-if="showPersonFormDialog">
          <el-form-item >
            <div class="video_style">
              <video v-show="showCameraOrPic === 'camera'"
                     id="video"
                     width="200px"
                     height="200px"
                     muted="false"
                     autoplay="autoplay">
              </video>
              <canvas v-show="showCameraOrPic === 'pic'" id="canvas" width="200px" height="200px"></canvas>
              <div></div>
              <el-button type="danger" @click="takePhoto">拍照</el-button>
            </div>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="personForm.name"
                      autocomplete="off"
                      style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="工号" :label-width="formLabelWidth" v-if="addOrEdit === 'edit'" >
            <el-input v-model="personForm.number"
                      autocomplete="off"
                      style="width: 70%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closePersonDialog">取 消</el-button>
          <el-button type="danger" @click="commitModify">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Person",
        data() {
          return {
            personList:[
            ],
            showPersonFormDialog: false,
            formLabelWidth :'120px',
            personForm:{
              image:'',
              name:'',
              number:'`',
            },
            addOrEdit:'add',
            addOrEditString:'',
            mediaStream:'',
            showCameraOrPic: 'camera'
          }
        },
        methods: {
          closeCamera() {
            this.mediaStream.getTracks()[0].stop();
            this.mediaStream.getTracks()[1].stop();
            this.mediaStream = '';
          },
          takePhoto() {
            this.showCameraOrPic = 'pic';

              let video = document.getElementById("video");
              let canvas = document.getElementById("canvas");
              let ctx = canvas.getContext('2d');
              ctx.getImage(video, 0, 0, 200, 200);

              this.personForm.image = canvas.toDataURL('image/png');
          },
          closePersonDialog () {
            this.closeCamera();
            this.showPersonFormDialog = false;
            this.personForm.name = '';
            this.personForm.image = '';
          },
          loadPersonList() {
            this.$axios.post('/allUser')
              .then((res) => {
                res.data.user_all.forEach((item ) => {
                  item.number = item.id+""
                })
                console.log(res.data);
                this.personList = res.data.user_all;
              })
          },
          deletePerson(id) {
            this.$axios.post('/deleteUser',
              this.qs.stringify({
                id: parseInt(id)
              }))
              .then(() => {
                for (let i = 0; i < this.personList.length; i++) {
                  if(this.personList[i].number === id) {
                    this.personList.splice(i, 1);
                    break;
                  }
                }
              })
          },
          handleDelete(value) {
            this.$confirm('确认删除？')
              .then(_ => {
                this.deletePerson(value);
              })
              .catch(_ => {});
          },
          editPerson() {

          },
          handleEdit() {
            this.showPersonFormDialog = true;
            this.addOrEdit = 'edit';
            this.addOrEditString = '修改';
          },
          addPerson() {
            if (this.personForm.image === '') {
              this.$message({
                type:'warning',
                message:'请先上传图片'
              })
              return;
            }
            let image = this.personForm.image.split(',')[1];

            this.$axios.post('/addUser_p',
              this.qs.stringify({
                name: this.personForm.name,
                image: image
              }))
              .then(() => {
                this.loadPersonList()

                this.personForm.image = '';
                this.personForm.name = '';
              })
          },

          handleAdd() {
            this.addOrEdit = 'add';
            this.addOrEditString = '新建';
            this.showPersonFormDialog = true;
            this.showCameraOrPic = 'camera';
            this.$nextTick(function () {
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
            });

          },
          commitModify() {
            if (this.addOrEdit === 'add') {
              this.addPerson();
            } else {
              this.editPerson();
            }
            this.showPersonFormDialog = false
          }
        },
        mounted() {
          this.loadPersonList()
        },
        watch:{
          showPersonFormDialog() {
            if( this.showPersonFormDialog === false && this.mediaStream) {
              this.closeCamera()
            }
          }
        }

    }
</script>

<style scoped>
  .list_style {
    width: 80%;
    margin-left: 10%;
    }
  .video_style {
    text-align: center;
  }
  .table_img {
    width: 60px;
    height: 60px;
  }
</style>
