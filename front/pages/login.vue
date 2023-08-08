<!--
 * @Author: WHO ELSE
 * @Date: 2020-05-07 15:54:52
 * @LastEditTime: 2020-05-09 10:14:52
 * @LastEditors: Do not edit
 * @FilePath: \my__kkb__project\front\pages\login.vue
 * @Description: 
 -->
<template>
  <div class="login-container">
    <h1>Login</h1>
    <el-form
      :model="loginForm"
      :rules="loginRules"
      status-icon
      ref="loginForm"
      label-width="100px"
      class="login-form"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="loginForm.email" autocomplete="on"></el-input>
      </el-form-item>
      <el-form-item label="图片验证码" class="captcha-container" prop="captcha">
        <div class="captcha">
          <img
            @click="updateCaptcha"
            class="login-img"
            :src="captcha"
            alt="图片验证码"
          />
        </div>
        <el-input v-model="loginForm.captcha" placeholder="验证码"></el-input>
      </el-form-item>
      <el-form-item
        class="captcha-container"
        label="邮箱验证码"
        prop="emailcode"
      >
        <div class="captcha">
          <el-button
            :disabled="send.timer > 0"
            type="primary"
            @click="sendEmailCode"
            >{{ sendText }}</el-button
          >
        </div>
        <el-input v-model="loginForm.emailcode" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click.native.prevent="handlerLogin('loginForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('loginForm')">重置</el-button>
        <el-link
          href="http://localhost:3000/api/download"
          target="_blank"
          type="primary"
          >download</el-link
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from "md5";
export default {
  name: "login",
  data() {
    var validatePass = (rule, value, callback) => {
      const regExp = /^[0-9A-Za-z]{6,16}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!regExp.test(value)) {
        callback(new Error("不能含有中文字符且长度在6-16位"));
      } else {
        callback();
      }
    };
    var validateCaptcha = (rule, value, callback) => {
      const regExp = /^[0-9A-Za-z]{4}$/;
      if (regExp.test(value)) {
        callback();
      } else {
        callback(new Error("验证码格式错误!"));
      }
    };
    var validateCode = (rule, value, callback) => {
      const regExp = /^[0-9]{4}$/;
      if (regExp.test(value)) {
        callback();
      } else {
        callback(new Error("验证码格式错误!"));
      }
    };
    return {
      send: { timer: 0 },
      captcha: "",
      loginForm: {
        email: "",
        password: "",
        captcha: "",
        emailcode: ""
      },
      loginRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        captcha: [
          {
            required: true,
            validator: validateCaptcha,
            trigger: "blur"
          }
        ],
        emailcode: [
          { required: true, validator: validateCode, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    sendText() {
      if (this.send.timer <= 0) {
        return "发送";
      } else {
        return `${this.send.timer}秒后发送`;
      }
    }
  },
  mounted() {
    this.captcha = "/api/captcha?_t=" + new Date().getTime();
  },
  methods: {
    // 发送邮件
    async sendEmailCode() {
      const res = await this.$http.get(
        "/sendcode?email=" + this.loginForm.email
      );
      if (res.data.code == 0) {
        this.$message({
          duration: 1500,
          message: res.data.message,
          type: "success"
        });
        this.send.timer = 60;
        this.timer = setInterval(() => {
          this.send.timer -= 1;
          if (this.send.timer <= 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      }
    },
    async handlerLogin(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let obj = {
            email: this.loginForm.email,
            captcha: this.loginForm.captcha,
            password: md5(this.loginForm.password),
            emailcode: this.loginForm.emailcode
          };
          const res = await this.$http.post("/login", obj);
          console.log("res", res);
          if (res.data.code == 0) {
            this.$message({
              duration: 1500,
              message: res.data.message,
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({ name: "upload" });
            }, 1800);
          } else {
            this.$message({
              duration: 1500,
              message: res.data.data,
              type: "error"
            });
          }
        } else {
          console.log("表单验证异常");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 更新图片验证码
    updateCaptcha() {
      this.captcha = "/api/captcha?_t=" + new Date().getTime();
    },
    //下载文件
    async download() {
      const res = await this.$http.get("/download");
      console.log("download", res);
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  .login-form {
    width: 520px;
    margin: 0 auto;
    padding: 50px 0;
    overflow: hidden;
    .captcha-container {
      width: 340px;
      position: relative;
      .el-button {
        width: 100px;
        height: 40px;
        padding: 0;
      }
      .captcha {
        position: absolute;
        right: -110px;
        .login-img {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
