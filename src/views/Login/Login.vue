<template>
  <div id="login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="~assets/img/avatar_box.jpg" alt="" />
      </div>
      <!-- 登陆表单 -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="login_form"
        ref="loginFormRef"
      >
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-s-goods"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="success" class="btn_login" @click="login"
            >登录</el-button
          >
          <el-button type="info" class="btn_resetting" @click="resetLoginForm"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="sky">
      <div class="stars one">
        <div class="dotted"></div>
        <div class="pulse1"></div>
        <div class="pulse2"></div>
        <div class="pulse3"></div>
      </div>
    </div>
    <div class="run"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //登陆表单数据绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //登陆表单验证规则
      loginRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, message: "密码长度不少于6个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      //当获取到的数据是promise对象时，可用async await来解析获取里面真实数据
      //token 当服务器和客户端之间需要跨域时使用,不跨域使用cookie、session
      //token 保存在sessionStorage中是因为sessionStorage是网站使用期间存储，而localStorage是持久化存储 ===> 1.2

      //1 将登录成功后的token保存到客户端的sessionStorage中
      //  1.1 项目中出现登陆之外的API接口时，必须在登录之后才能访问
      //  1.2 token 只应在当前网站打开期间生效，所以将token 保存在sessionStorage中
      //2 通过编程式导航跳转到后台主页，路由地址为 /home
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200)
          return this.$message.error("账号或密码错误");
        this.$message.success("登录成功");
        //步骤 1
        window.sessionStorage.setItem("token", res.data.token);
        //步骤 2
        this.$router.push("/home");
      });
    },
  },
};
</script>
<style lang="less" scoped>
#login {
  background-color: #373D41;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  z-index: 99999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
}

.btns {
  display: flex;
  justify-content: flex-end;

  .btn_login,
  .btn_resetting {
    margin: 0 65px;
  }
}

.sky {
  position: relative;
  width: 1500px;
  height: 400px;
}

.one {
  position: absolute;
  top: 600px;
  left: 1170px;
}
.dotted {
  width: 8px;
  height: 8px;
  background-color: #09f;
  border-radius: 50%;
}

.stars div[class^="pulse"] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  box-shadow: 0 0 12px #009dfd;
  border-radius: 50%;
  /* linear 匀速 infinite无限循环*/
  animation: pulse 1.2s linear infinite;
}

.stars div.pulse2 {
  animation-delay: 0.4s;
}

.stars div.pulse3 {
  animation-delay: 0.8s;
}

@keyframes pulse {
  0% {
  }
  70% {
    width: 40px;
    height: 40px;
    opacity: 1;
  }
  100% {
    width: 70px;
    height: 70px;
    opacity: 0;
  }
}

.run {
  position: absolute;
  bottom: 0;
  width: 200px;
  height: 100px;
  background: url(~assets/img/daxiong.png) no-repeat;
  /* 元素可添加多个动画，用逗号分割 */
  animation: move 0.5s steps(8) infinite, stop 3s forwards;
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -1600px 0;
  }
}

@keyframes stop {
  0% {
    left: 0;
  }
  100% {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>