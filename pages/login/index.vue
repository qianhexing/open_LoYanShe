<template>
  <div class="login-page">
    <div class="logtin-back">
      <div class="login-box-wrap">
        <div class="login-box">
          <div class="login-title">
            登录
          </div>
          <div class="login-form">
            <el-form :model="loginForm" :rules="rules" ref="login" >
              <el-form-item prop="user_phone">
                <el-input v-model="loginForm.user_phone" placeholder="手机号"></el-input>
              </el-form-item>
              <el-form-item prop="user_password">
                <el-input type="password" v-model="loginForm.user_password" placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width: 100%;" @click="loginNode()">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
              </el-form-item>
              <el-form-item>
                <div class="login-footer">
                  <el-checkbox-group v-model="is_remember"  @change="changeIsRemeber()">
                    <el-checkbox label="记住密码" name="type"></el-checkbox>
                  </el-checkbox-group>
                  <!-- <a href="https://lolitalibrary.com/lolita.html#/register" target="_blank">没有账号?注册一个！</a> -->
                  <nuxt-link :to="'/register'">没有账号?注册一个！</nuxt-link>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setLoginType, loginIn } from '../../api/user.js'
export default {
  data () {
    return {
      loginForm: {
        user_phone: '',
        user_password: ''
      },
      loading: false,
      is_remember: false,
      rules: {
        user_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        user_password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  layout: 'LoginLayout',
  mounted () {
    const is_remember = localStorage.getItem('is_remember')
    console.log(is_remember)
    console.log(this.$store)
    if (is_remember && is_remember !== null) {
      this.is_remember = true
      const user_info = JSON.parse(is_remember)
      this.loginForm = user_info
    }
  },
  methods: {
    loginNode () {
      this.$refs.login.validate((valid) => {
        if (this.loading === true) {
          this.$message.warning('请求中请稍后')
          return false
        }
        this.loading = true
        const params = {
          user_phone: this.loginForm.user_phone,
          user_password: this.loginForm.user_password
        }
        loginIn(params)
          .then((res) => {
            console.log(res)
            const data = res.data
            if (res.code === 200) {
              this.$message.success('登录成功，跳转主页')
              const token = data.token
              const user_info = {
                user_face: data.data.userFace,
                user_name: data.data.userName,
                user_id: data.data.userId
              }
              const permission = []
              if (data.permission && data.permission.length > 0) {
                data.permission.forEach((item) => {
                  permission.push(item.permissions)
                })
              }
              this.$store.commit('setToken', token)
              this.$store.commit('setUserInfo', user_info)
              this.$store.commit('setPermissions', permission)
              setLoginType()
              setTimeout(() => {
                this.$router.push({
                  path: '/'
                })
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    login () {
      this.$refs.login.validate((valid) => {
        if (this.loading === true) {
          this.$message.warning('请求中请稍后')
          return false
        }
        this.loading = true
        if (valid) {
          this.$axios({
            baseURL: this.BASE_JAVA,
            url: '/user/login',
            method: 'POST',
            data: {
              userPhone: this.loginForm.user_phone,
              userPassword: this.loginForm.user_password
            }
          })
            .then((res) => {
              console.log(res)
              const data = res.data
              if (data.resultCode === '0') {
                this.$message.success('登录成功，3秒后跳转主页')
                const token = data.token
                const user_info = {
                  user_face: data.data.userFace,
                  user_name: data.data.userName,
                  user_id: data.data.userId
                }
                this.$store.commit('setToken', token)
                this.$store.commit('setUserInfo', user_info)
                setLoginType()
                setTimeout(() => {
                  this.$router.push({
                    path: '/'
                  })
                }, 3000)
              } else {
                this.$message.error(res.data.resultMsg)
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    changeIsRemeber () {
      console.log(this.is_remember)
      if (this.is_remember === true) {
        const user_info = JSON.stringify(this.loginForm)
        localStorage.setItem('is_remember', user_info)
      }
    }
  }
}
</script>

<style lang="less">
.login-page{
  .logtin-back{
    width: 100%;
    height: calc(100vh);
    background: url("https://lolitalibrary.com/ali/ssr/login/b2.jpg") no-repeat;
    background-size: cover;
    .login-box-wrap{
      transition: 0.3s;
      margin: 0 auto;
      padding-top: calc(50vh - 160px);
      .login-box{
        padding: 10px;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 2px 2px 10px #ccc;
        border-radius: 5px;
        .login-title{
          font-size: 18px;
          text-align: center;
          margin: 10px;
          font-weight: bolder;
          line-height: 25px;
          padding-bottom: 10px;
          border-bottom: 2px linear-gradient(#69e0ff, #69e0ff) solid;
           // #69e0ff, 0 0 20px #69e0ff, 0 0 40px #69e0ff
        }
        .login-form{
          padding: 0 20px;
        }
        .login-footer{
          display: flex;
          justify-content: space-between;
          a{
            color: #3A8EE6;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .login-box-wrap{
    width: 100%;
  }
}
@media screen and (min-width: 750px) {
  .login-box-wrap{
    width: 450px;
  }
}
</style>
