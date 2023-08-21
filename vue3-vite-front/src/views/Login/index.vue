<template>
  <div class="login flex justify-center items-center w-full h-full">
    <div
      class="login-form text-center p-10 w-3/6 h-96 rounded border-2 border-slate-200 border-solid"
    >
      <h1 class="text-3xl font-bold mb-10">登录</h1>
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="">
        <el-form-item label="" prop="username">
          <el-input v-model.number="ruleForm.username" />
        </el-form-item>
        <el-form-item label="" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="" prop="checkPass">
          <el-input
            autofocus
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item class="mt-10">
          <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>
      </>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import { login, register } from '@/api/login';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
const ruleFormRef = ref<FormInstance>();
const { proxy } = getCurrentInstance();

const checkCode = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入验证码'));
  }
  callback();
};

const checkUsername = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the username'));
  }
  callback();
  // setTimeout(() => {
  //   if (!Number.isInteger(value)) {
  //     callback(new Error('Please input digits'));
  //   } else {
  //     if (value < 18) {
  //       callback(new Error('Age must be greater than 18'));
  //     } else {
  //       callback();
  //     }
  //   }
  // }, 1000);
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'));
  } /*  else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField('checkPass', () => null);
    }
    callback();
  }*/
  callback();
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'));
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  pass: '',
  code: '',
  checkPass: '',
  username: '',
});

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  username: [{ validator: checkAge, trigger: 'blur' }],
});

const handleLogin = (formEl: FormInstance | undefined) => {
  console.log('formEl', formEl === proxy.$refs.ruleFormRef);
  // console.log('proxy.$refs.ruleFormRef', proxy.$refs.ruleFormRef);
  //   proxy.$refs.ruleFormRef.validate((valid:any) => {
  //   console.log('proxy - valid', valid);
  // });
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      // if (valid) { }
      console.log('ruleForm', ruleForm);
      if (ruleForm.username === 'admin' && ruleForm.pass === '111111' && ruleForm.code === '1111') {
        ElMessage({
          message: '登录成功!',
          type: 'success'
        });
        setTimeout(function () {
          router.push('/');
        }, 2000);
      } else {
                  ElMessage({
    message: '登录失败!',
    type: 'error',
  })
        formEl.resetFields();
      }
    } else {
      console.log('error submit!');
      return false;
    }
  });
};

const handleRegister = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style>
/* @media (min-width: 1024px) {
  .login {
    display: flex;
    align-items: center;
  }
} */

/* .login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(120, 121, 122, 0.5);
}
.login-form {
  width: 500px;
  height: 360px;
  border: 1px solid rgba(87, 166, 246, 0.5);
  box-shadow: 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),
    6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028), 12.5px 12.5px 10px rgba(0, 0, 0, 0.035),
    22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042), 41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),
    100px 100px 80px rgba(0, 0, 0, 0.07);
} */
</style>
