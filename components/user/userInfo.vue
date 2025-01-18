<template>
  <div>
    <div class="pub-user-info" v-if="user_info">
      <div class="user-left">
        <div>
          <div class="user-face">
            <img :src="user_info.user_face && user_info.user_face !== null ? BASE_IMG + user_info.user_face : BASE_IMG + 'static/user_face/default.jpg'" alt="">
          </div>
        </div>
        <div class="avatar_frame" v-if="user_info.user_avatar">
          <img :src="BASE_IMG + user_info.user_avatar" >
        </div>
      </div>
      <div class="user-right">
        <div class="user-name">
          {{user_info.user_name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'user_info'
  ]
}
</script>

<style scoped lang="less">
  .pub-user-info{
    display: flex;
    align-items: center;
    .user-left{
      width: 70px;
      height: 70px;
      position: relative;
      .avatar_frame{
        position: absolute;
        top: 0;
        left: 0;
        img{
          width: 70px;
          height: 70px;
        }
      }
      .user-face{
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;
        margin: 10px;
        img{
          width: 100%;
        }
      }
    }
    .user-right{
      flex: 1;
      margin-left: 5px;
      .user-name{
        font-size: 16px;
        font-weight: bolder;
        color: #FFAA7F;
      }
    }
  }
</style>
