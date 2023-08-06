<!--
 * @Author: RONGWEI PENG
 * @Date: 2020-05-06 17:31:30
 * @LastEditTime: 2020-05-08 16:08:26
 * @LastEditors: Do not edit
 * @FilePath: \my__kkb__project\front\pages\register.vue
 * @Description: 
 -->
<template>
  <div class="register-container">
    <h1>Register</h1>
    <el-form
      :model="registerForm"
      :rules="registerRules"
      status-icon
      ref="registerForm"
      label-width="100px"
      class="register-form"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="registerForm.nickname" autocomplete="on"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email" autocomplete="on"></el-input>
      </el-form-item>
      <!--   <el-form-item label="邮箱验证码" prop="code">
        <el-input v-model="registerForm.code"></el-input>
      </el-form-item> -->
      <el-form-item label="图片验证码" class="captcha-container" prop="captcha">
        <div class="captcha">
          <img
            @click="updateCaptcha"
            class="register-img"
            :src="captcha"
            alt="图片验证码"
          />
        </div>
        <el-input
          v-model="registerForm.captcha"
          placeholder="验证码"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="registerForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="registerForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click.native.prevent="handlerRegister('registerForm')"
          >注册</el-button
        >
        <el-button @click="resetForm('registerForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from "md5";

export default {
  name: "register",
  data() {
    var validatePass = (rule, value, callback) => {
      const regExp = /^[0-9A-Za-z]{6,16}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!regExp.test(value)) {
        callback(new Error("不能含有中文字符且长度在6-16位"));
      } else {
        if (this.registerForm.checkPass !== "") {
          this.$refs.registerForm.validateField("checkPass", errorMessage => {
            console.log("validateField-errorMessage", errorMessage);
            if (!errorMessage) {
              console.log("验证通过");
            } else {
              callback(new Error(errorMessage));
              return false;
            }
          });
        }
        callback();
      }
    };
    var validateRePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateNickname = (rule, value, callback) => {
      const regExp = /^[\u4e00-\u9fa5]+$/; //  \u4e00-\u9fa5 是中文字符的unicode编码
      if (value.match(regExp)) {
        console.log("校验中文字符成功");
        callback();
      } else {
        callback(new Error("输入内容中包括非中文字符!"));
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
    return {
      captcha: "",
      registerForm: {
        password: "",
        checkPass: "",
        email: "",
        captcha: "",
        nickname: ""
      },
      registerRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱", trigger: "blur" }
        ],
        nickname: [
          { required: true, validator: validateNickname, trigger: "blur" }
        ],
        captcha: [
          { required: true, validator: validateCaptcha, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validateRePass, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.captcha = "/api/captcha?_t=" + new Date().getTime();
  },
  methods: {
    async handlerRegister(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let obj = {
            email: this.registerForm.email,
            captcha: this.registerForm.captcha,
            password: md5(this.registerForm.password),
            checkPass: md5(this.registerForm.checkPass),
            nickname: this.registerForm.nickname
          };
          // const res = await this.$http.post("./user/register", obj);
          const res = await this.$http.post("/register", obj);

          console.log("console", res, res.data.code);
          if (res.data.code == 0) {
            this.$message({
              duration: 1500,
              message: res.data.message,
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({ path: "/login" });
              // this.$router.push({ name: "login" });
            }, 1500);
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
    updateCaptcha() {
      this.captcha = "/api/captcha?_t=" + new Date().getTime();
    }
  }
};
</script>

<style lang="less" scoped>
.register-container {
  width: 100%;
  height: 100%;
  .register-form {
    width: 520px;
    // height: 100%;
    margin: 0 auto;
    padding: 50px 0;
    overflow: hidden;

    .captcha-container {
      width: 340px;
      position: relative;
      .captcha {
        position: absolute;
        right: -110px;
        .register-img {
          /*      width: 90px;
          height: 50px; */
          cursor: pointer;
        }
      }
    }
  }
}
</style>
