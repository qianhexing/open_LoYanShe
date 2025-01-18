<template>
  <div :style="{ width: width + 'px', height: width + 'px' }" class="lolita-avatar">
    <img :src="user_face" :style="{ width: 'calc(' + width + 'px - 20%)', height: 'calc(' + width + 'px - 20%)', padding: '10%', borderRadius: border_radius }">
    <img v-if="avatar_frame" :src="avatar_frame" :style="{ width: '100%', height: '100%' }" class="lolita-avatar-frame">
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    user_face: {
      type: String,
      default: ''
    },
    // eslint-disable-next-line vue/prop-name-casing
    avatar_frame: {
      type: String,
      default: undefined
    },
    width: {
      type: Number,
      default: 100
    },
    // eslint-disable-next-line vue/prop-name-casing
    border_radius: {
      type: String,
      default: '50%'
    }
  }
}
</script>

<style scoped lang="less">
.lolita-avatar{
  position: relative;
  overflow: hidden;
  .lolita-avatar-frame{
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
