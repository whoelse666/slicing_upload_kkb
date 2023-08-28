<!--
 * @Author: WHO ELSE
 * @Date: 2020-05-08 15:29:25
 * @LastEditTime: 2023-08-07 22:21:06
 * @LastEditors: pengrongwei
 * @FilePath: \my__kkb__project\front\pages\upload.vue
 * @Description:
 -->

<template>
  <div class="upload">
    <div class="file-box">
      <input type="file" multiple @change="handleFileChange" />
    </div>
    <el-progress
      :text-inside="true"
      :stroke-width="24"
      :percentage="percentage"
      :status="status"
    ></el-progress>
    <el-button type="primary" @click="uploadFile">上传</el-button>
    <div>
      <el-image
        style="width: 100px; height: 100px"
        :src="url"
        fit="fill"
      ></el-image>
    </div>
  </div>
</template>

<script>
export default {
  name: "upload",
  data() {
    return {
      baseUrl: "http://127.0.0.1:7001",
      url: "",
      percentage: 0,
      status: "exception" //warning  exception  success
    };
  },
  methods: {
    handleFileChange(e) {
      const [file] = e.target.files;
      console.log("console", file);
      if (file) {
        this.percentage = 0;
        this.status = "exception";
        this.file = file;
      }
    },
    async uploadFile() {
      if (!this.file) {
        this.alertMessage("warning", "请先选择文件");
        return;
      }
      if (!(await this.isImage(this.file))) {
        this.alertMessage("warning", "文件格式不正确");
        return;
      }
      const file = this.file;
      const form = new FormData();
      form.append("name", file.name);
      form.append("file", file);
      const res = await this.$http.post("/uploadfile", form, {
        onUploadProgress: progressEvent => {
          console.log("progressEvent", progressEvent);
          if (progressEvent.loaded < progressEvent.total) {
            this.percentage =
              (progressEvent.loaded / progressEvent.total) * 100;
          } else {
            this.percentage = 100;
            this.status = "success";
          }
        }
      });

      if (res.data.code === 0) {
        this.alertMessage("success", res.data.message);
        this.url = this.baseUrl + res.data.data;
      } else {
        this.percentage = 0;
        this.status = "exception";
        this.alertMessage("error", res.data.message);
      }
    },

    /* 判断上传文件格式 */
    async isImage(file) {
      let system = "",
        suffixName = "";
      if (!file) {
        return;
      }
      suffixName = file.name
        .split(".")
        [file.name.split(".").length - 1].toLowerCase();
      console.log("suffixName==", suffixName);
      if (suffixName === "jpg") {
        const systemEnd = await this.blobToString(file.slice(-2));
        const systemStart = await this.blobToString(file.slice(0, 2));
        system = systemStart + "-" + systemEnd;
      } else {
        system = await this.blobToString(file.slice(0, 6));
      }
      return this.imageTypeHeader(suffixName, system);
    },

    /* // ?验证文件真实信息,如图片头信息 */
    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onloadend = function(e) {
          const ret = e.target.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, "0"));
          // .join();
          console.log(ret);
          resolve(ret);
        };
      });
    },

    /* 判断后缀名和二进制头信息是否匹配 */
    imageTypeHeader(nameType, headType) {
      let isOk = false;
      switch (nameType) {
        case "jpg":
          let startAndEnd = headType.split("-");
          isOk = startAndEnd[0] === "FF,D8" && startAndEnd[1] === "FF,D9";
          break;
        case "gif":
          isOk =
            headType === "47,49,46,38,39,61" ||
            headType === "47,49,46,38,37,61";
          break;
        case "png":
          isOk = headType === "89,50,4E,47,0D,0A,1A";
          break;
        default:
          break;
      }
      console.log("isOk", isOk);
      return isOk;
    },

    alertMessage(type = "warning", message = "", duration = 1500) {
      this.$message({
        duration,
        type,
        message
      });
    }
  }
};
</script>

<style lang="less" scoped>
.upload {
  width: 100%;
  height: 100%;

  .file-box {
    padding: 0;
    text-align: center;
    margin: 10px auto;
    width: 520px;
    line-height: 100px;
    height: 100px;
    box-sizing: border-box;
    border: 1px dashed slateblue;
    input {
      border: 1px bisque solid;
    }
  }
}
</style>
