<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      to: null
    }
  },
  created () {
    if (this.$route.query.to) {
      this.to = this.$route.query.to
      setTimeout(() => {
        this.$router.push(this.to)
      })
      this.$router.push({
        path: '/blank',
        query: {}
      })
    } else {
      this.$router.go(-2)
    }
  }
}
</script>

<style>
</style>
