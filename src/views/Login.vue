<template>
  <div class="login_container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/avatar.jpg"
             alt="">
      </div>
      <el-form ref="loginRef"
               class="login-form"
               label-width="0px"
               :model="loginForm"
               :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input class="input"
                    v-model="loginForm.username"
                    prefix-icon="el-icon-user-solid"
                    autofocus>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input class="input"
                    v-model="loginForm.password"
                    prefix-icon="el-icon-unlock"
                    type="password">
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="isLogin">登录</el-button>
          <el-button type="info"
                     @click="resetLoginForm">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入帐号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮 清空表单
    resetLoginForm () {
      this.$refs.loginRef.resetFields()
      this.loginForm.username = this.loginForm.password = ''
    },
    // 点击登录按钮 做验证，成功则跳转页面
    isLogin () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login-box {
    width: 650px;
    height: 400px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-form {
      position: absolute;
      bottom: 60px;
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      .input {
        font-size: 18px;
      }
    }

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
