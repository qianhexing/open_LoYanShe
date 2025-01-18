<template>
  <div class="register-page">
    <div class="logtin-back">
      <div class="login-box-wrap">
        <div class="login-box">
          <div class="login-title">
            注册
          </div>
          <div class="login-form">
            <el-form ref="ruleForm" :model="loginForm" :rules="rules">
              <el-form-item prop="user_name">
                <el-input v-model="loginForm.user_name" placeholder="用户昵称" @change="checkHasUserName"></el-input>
              </el-form-item>
              <el-form-item prop="user_phone">
                <el-input v-model="loginForm.user_phone" placeholder="手机号" @change="checkHasUserPhone"></el-input>
              </el-form-item>
              <el-form-item prop="user_password">
                <el-input v-model="loginForm.user_password" placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item prop="check_password">
                <el-input v-model="loginForm.check_password" placeholder="确认密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width: 100%;" @click="getSmsCode()" v-if="!sms_time">获取验证码</el-button>
                <el-button type="warning" style="width: 100%;" v-else>{{ sms_time }}</el-button>
              </el-form-item>
              <el-form-item prop="sms_code">
                <el-input v-model="loginForm.sms_code" placeholder="请输入验证码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="width: 100%;" @click="register()">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</el-button>
              </el-form-item>
              <el-form-item>
                <div class="login-footer">
                  <div></div>
                  <nuxt-link :to="'/login'">已有账号？前往登录！</nuxt-link>
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
import { getSmsCode, checkHasName, insertUser, setLoginType, loginIn } from '@/api/user.js'
export default {
  data () {
    const checKUser = (rule, value, callback) => {
      if (this.has_user_name === true) {
        callback(new Error('昵称已存在!'))
      } else {
        callback()
      }
    }
    const checKUserPhone = (rule, value, callback) => {
      if (this.has_user_phone === true) {
        callback(new Error('手机号已注册!'))
      } else {
        callback()
      }
    }
    const isUserName = (rule, value, callback) => {
      // eslint-disable-next-line
      const containSpecial = new RegExp(/[(\ )(\~)(\~)(\!)(\！)(\@)(\#)(\$)(\￥)(\%)(\^)(\……)(\&)(\*)(\()(\（)(\))(\）)(\-)(\_))(\——)(\+)(\=)(\[)(\【)(\])(\】)(\{)(\})(\|))(\、))(\)(\\)(\;)(\；)(\:)(\：)(\')(\‘)(\’)(\")(\“)(\”)(\,)(\，)(\.)(\。)(\/)(\《)(\<)(\>)(\》)(\?)(\？)(\)]+/)
      if (containSpecial.test(value)) {
        callback(new Error('昵称不可以有特殊字符'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.loginForm.user_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        user_phone: '',
        user_password: '',
        user_name: '',
        check_password: ''
      },
      loading: false,
      has_user_name: false,
      has_user_phone: false,
      is_rember: false,
      sms_time: null,
      rules: {
        user_name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 1, max: 6, message: '昵称1-6个字', trigger: 'blur' },
          { validator: isUserName, trigger: 'blur' },
          { validator: checKUser, trigger: 'blur' }
        ],
        user_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
          { validator: checKUserPhone, trigger: 'blur' }
        ],
        user_password: [
          { min: 6, message: '密码必须大于6位', trigger: 'blur' },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        check_password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        sms_code: [
          { required: true, message: '验证码不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  layout: 'LoginLayout',
  mounted () {
    this.$nextTick(() => {
      const sms_time = localStorage.getItem('sms_time')
      if (sms_time) {
        this.countDown()
      }
    })
  },
  methods: {
    register () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('register')
          const params = {
            ...this.loginForm
          }
          insertUser(params)
            .then((res) => {
              const { code, data } = res
              if (code === 200) {
                console.log(data)
                this.$message.success('注册成功')
                this.loginNode()
              }
            })
        }
      })
    },
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
              this.$store.commit('setToken', token)
              this.$store.commit('setUserInfo', user_info)
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
    countDown () {
      this.sms_time = localStorage.getItem('sms_time')
      if (this.sms_time !== null && this.sms_time > 0) {
        setTimeout(() => {
          this.sms_time = parseInt(this.sms_time) - 1
          localStorage.setItem('sms_time', this.sms_time)
          this.countDown()
        }, 1000)
      } else {
        localStorage.removeItem('sms_time')
        this.sms_time = null
      }
    },
    async checkHasUserName (value) {
      const params = {
        user_name: value
      }
      const resault = await this.checkHasUser(params)
      this.has_user_name = resault.data
      this.$refs.ruleForm.validate()
    },
    async checkHasUserPhone (value) {
      const params = {
        user_phone: value
      }
      const resault = await this.checkHasUser(params)
      this.has_user_phone = resault.data
      this.$refs.ruleForm.validate()
    },
    checkHasUser (params) {
      return new Promise((resolve) => {
        checkHasName(params)
          .then((res) => {
            resolve(res)
          })
      })
    },
    getSmsCode () {
      if (this.loading) {
        this.$message.warning('请求中请稍候')
        return false
      }
      if (this.loginForm.user_phone === '') {
        this.$message.warning('手机号不可为空')
        return false
      }
      this.loading = true
      const params = {
        user_phone: this.loginForm.user_phone
      }
      getSmsCode(params)
        .then((res) => {
          if (res.code === 200) {
            this.countDown()
            localStorage.setItem('sms_time', 60)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less">
.register-page{
  .logtin-back{
    width: 100%;
    height: calc(100vh);
    background: url("https://lolitalibrary.com/ali/ssr/login/b2.jpg") no-repeat;
    background-size: cover;
    .login-box-wrap{
      transition: 0.3s;
      margin: 0 auto;
      padding-top: calc(50vh - 288px);
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
