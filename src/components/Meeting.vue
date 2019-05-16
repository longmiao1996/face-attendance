<template>
  <div style="height: 100%;">
    <create-meeting v-if="state === 0" v-on:changeState="changeState"></create-meeting>
    <sign-meeting v-if="state === 1" v-on:changeState="changeState"></sign-meeting>
  </div>
</template>

<script>
    import CreatMeeting from './meet/CreatMeeting'
    import SignMeeting from './meet/SignMeeting'
    export default {
      name: "Meeting",
      components: {
        'create-meeting': CreatMeeting,
        'sign-meeting' : SignMeeting,
      },
        data() {
          return{
            state: 0,
          }
        },
        methods:{
          changeState(val) {
            this.state = val;
          }
        },
        mounted() {
          this.$axios.post('/sign')
            .then((res) => {
              this.state = res.data.state
            })
        }
    }
</script>

<style scoped>

</style>
