<!--
 * @Author: WHO ELSE
 * @Date: 2020-05-08 15:29:25
 * @LastEditTime: 2023-08-08 23:27:58
 * @LastEditors: pengrongwei
 * @FilePath: \my__kkb__project\front\pages\uploadchunk.vue
 * @Description:
 -->
<template>
  <div class="upload">
    <img v-if="dialogImageUrl" :src="dialogImageUrl" width="100" height="100" />

    <div class="file-box">
      <a href="javascript:;" class="file"
        >选择文件
        <input type="file" multiple @change="handleFileChange" />
      </a>
    </div>
    <el-progress
      :text-inside="true"
      :stroke-width="24"
      :percentage="percentage"
      :status="status"
    ></el-progress>
    <div class="button-box">
      <el-button type="primary" @click="uploadFile">上传</el-button>
      <el-button type="primary" @click="uploadChunks">chunks上传</el-button>
    </div>
    <!-- //* 切片-方格进度显示 -->
    <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
      <div class="cube" v-for="chunk in chunks" :key="chunk.name">
        <div
          :class="{
            success: chunk.progress == 100,
            error: chunk.progress < 0,
            uploading: chunk.progress > 0 && chunk.progress < 100,
          }"
          :style="{ height: chunk.progress + '%' }"
        >
          <i
            class="el-icon-loading"
            style="color: #f56c6c"
            v-if="chunk.progress < 100 && chunk.progress > 0"
          ></i>
        </div>
      </div>
    </div>
    <div class="demo-image__lazy block">
      <el-image
        :src="url"
        :preview-src-list="srcList"
        lazy
        style="width: 100px; height: 100px"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i></div
      ></el-image>
    </div>
    <!-- <pre>{{ chunks | json }}</pre> -->
  </div>
</template>

//***************************************************************************************/
<script>
import sparkMD5 from "spark-md5";
const CHUNK_SIZE = (1 / 16) * 1024 * 1024;
export default {
  name: "uploadchunk",
  data() {
    return {
      baseUrl: "http://127.0.0.1:7001",
      file: null,
      chunks: [],
      percentage: 0,
      status: "exception", //warning  exception  success
      url: "",
      srcList: [],

      dialogImageUrl: "",
      // dialogImageUrl:
      //   "https://img0.baidu.com/it/u=1940593137,1886084398&fm=253&fmt=auto&app=120&f=JPEG?w=625&h=500"
    };
  },
  computed: {
    cubeWidth() {
      console.log("cubeWidth==", this.chunks.length);
      return Math.ceil(Math.sqrt(this.chunks.length) * 16);
    },
  },
  methods: {
    // input  change事件
    handleFileChange(e) {
      const that = this;
      const [file] = e.target.files;
      console.log("file", file);
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        that.dialogImageUrl = e.target.result;
      };
      this.inputImg = file.url;
      if (!file || !file.size) {
        this.alertMessage("error", "文件获取异常");
        return;
      }
      if (file) {
        this.percentage = 0;
        this.status = "exception";
        this.file = file;
      }
    },

    /**
     * @Name: WHO ELSE
     * @Date: 2020-05-09 13:45:42
     * @LastEditTime: Do not edit
     * @Description: 文件切块
     * @param {type} {}
     * @return: {chunks  文件切片的数组}
     */
    createFileChunk(file, chunkSize = CHUNK_SIZE) {
      const chunks = [];
      if (file) {
        let cur = 0;
        while (cur < file.size) {
          chunks.push({
            index: cur,
            file: file.slice(
              cur,
              cur + chunkSize > file.size ? file.size : cur + chunkSize
            ),
          });
          cur += chunkSize;
        }
      }

      return chunks;
    },

    //计算hash Worker
    async calcuateHashWorker(chunks) {
      return new Promise((resolve) => {
        this.worker = new Worker("/hash.js");
        this.worker.postMessage({ chunks });
        this.worker.onmessage = (event) => {
          const { progress, hash } = event.data;
          this.hashPercentage = Number(progress.toFixed(2));
          if (hash) {
            if (this.hashPercentage === 100) {
              this.hashUploadStatus = "success";
            }
            resolve(hash);
          }
        };
      });
    },

    /**
     * @Name: WHO ELSE
     * @Date: 2020-05-09 15:10:30
     * @LastEditTime: Do not edit
     * @Description: 计算hash Idle
     * @param {type} {}
     * @return: {文件切片的哈希值}
     */
    async calcuateHashIdle(chunks) {
      return new Promise((resolve) => {
        const spark = new sparkMD5.ArrayBuffer();
        let count = 0;
        const appendToSpark = async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
              spark.append(e.target.result);
              resolve();
            };
          });
        };
        const workLoop = async (deadline) => {
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            await appendToSpark(chunks[count].file);
            count++;
            if (count < chunks.length) {
              this.hashPercentage = Number(
                ((count * 100) / chunks.length).toFixed(2)
              );
            } else {
              this.hashPercentage = 100;
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop); //window.requestIdleCallback(callback[, options])
        };
        window.requestIdleCallback(workLoop);
      });
    },

    /**
     * @Name: WHO ELSE
     * @Date: 2020-05-09 14:32:29
     * @LastEditTime: Do not edit
     * @Description: 计算文件的哈希值
     * @param {type} {}
     * @return: {}
     */
    async calcuateHash(chunkSize = CHUNK_SIZE) {
      return new Promise((resolve) => {
        let blobSlice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice,
          file = this.file,
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new sparkMD5.ArrayBuffer(),
          fileReader = new FileReader();
        //读取操作完成时
        fileReader.onload = function (e) {
          spark.append(e.target.result); // Append array buffer
          currentChunk++;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            const hash = spark.end();
            console.info("finished loading computed hash===", hash); // Compute hash
            resolve(hash);
          }
        };

        //读取操作发生错误
        fileReader.onerror = function (e) {
          console.log("onerror", e);
        };

        //执行的计算
        function loadNext() {
          var start = currentChunk * chunkSize,
            end =
              start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        //start
        loadNext();
      });
    },

    /**
     * @Name: WHO ELSE
     * @Date: 2020-05-09 13:44:34
     * @LastEditTime: Do not edit
     * @Description: 上传文件
     * @param {type} {}
     * @return: {}
     */
    async uploadFile() {
      if (!this.file) {
        return this.alertMessage("warning", "请选择文件");
      }
      if (!(await this.isImage(this.file))) {
        this.alertMessage("warning", "文件格式不正确");
        return;
      }
      const file = this.file;
      const form = new FormData();
      form.append("name", file.name + "_" + new Date());
      form.append("file", file);
      const res = await this.$http.post("/uploadfile", form, {
        onUploadProgress: (progressEvent) => {
          console.log("progressEvent", progressEvent);
          if (progressEvent.loaded < progressEvent.total) {
            this.percentage =
              (progressEvent.loaded / progressEvent.total) * 100;
          } else {
            this.percentage = 100;
            this.status = "success";
          }
        },
      });
      if (res.data.code === 0) {
        this.alertMessage("success", res.data.message);
        this.url = this.baseUrl + res.data.data;
        this.$set(this.srcList, 0, this.baseUrl + res.data.data);
      } else {
        this.percentage = 0;
        this.status = "exception";
        this.alertMessage("error", res.data.message);
      }
    },

    /**
     * @Name: WHO ELSE
     * @Date: 2020-05-09 15:17:45
     * @LastEditTime: Do not edit
     * @Description: 切片上传文件
     * @param {type} {}
     * @return: {}
     */
    async uploadChunks() {
      if (!this.file) {
        return this.alertMessage("warning", "请选择文件");
      }
      let chunks = this.createFileChunk(this.file);
      // 使用哈希值给文件命名
      // const hash = await this.calcuateHash();
      const hash = await this.calcuateHashWorker(chunks); //完整文件的hash 值
      // const hash = await this.calcuateHashIdle(chunks);
      // const hash = sparkMD5.hash("WhoElse");
      console.log("console", hash);
      this.chunks = chunks.map((chunk, index) => {
        let name = hash + "-" + index;
        return {
          name, //required  方块进度显示用切片文件命名
          hash, //required  文件夹命名
          // index,
          chunk: chunk.file, //required
          //*判断已经上传的切片,精度条方格显示100%
          // progress: uploaddedList.indexOf(name) > -1 ? 100 : 0,
          progress: 0, //required  方块进度显示用
        };
      });
      chunks = this.chunks;
      const requests = chunks
        .map((chunk, index) => {
          const form = new FormData();
          form.append("name", chunk.name);
          form.append("hash", chunk.hash);
          // form.append("index", chunk.index);
          form.append("chunk", chunk.chunk);
          console.log("form.getAll()", form.getAll());
          return form;
        })
        .map((form, index) =>
          this.$http.post("/uploadfilechunks", form, {
            onUploadProgress: (progressEvent) => {
              const p = (
                (progressEvent.loaded / progressEvent.total) *
                100
              ).toFixed(2);
              console.log(p);
              this.chunks[index].progress = p;
            },
          })
        );
      await Promise.all(requests).then(async (ret) => {
        if (ret[0].data.code == -1) {
          // 判断是否已存在
          return this.alertMessage("warning", ret[0].data.message);
        }
        const res = await this.mergeRequest(this.file, CHUNK_SIZE, hash);
        this.url = this.baseUrl + res.data.url;
        this.$set(this.srcList, 0, this.baseUrl + res.data.url);
        this.file = "";
      });
    },

    /**
     * @Name: WHO ELSE
     * @Date: 2020-05-09 15:54:41
     * @LastEditTime: Do not edit
     * @Description: 合并切片文件
     * @param {type} {}
     * @return: {}
     */
    async mergeRequest(file, size = CHUNK_SIZE, hash) {
      return new Promise((resolve, reject) => {
        this.$http
          .post("/mergefile", {
            ext: file.name.split(".").pop(),
            size,
            hash,
          })
          .then((res) => {
            resolve(res.data);
            this.$message.success("上传成功!");
          });
      });
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
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onloadend = function (e) {
          const ret = e.target.result
            .split("")
            .map((v) => v.charCodeAt())
            .map((v) => v.toString(16).toUpperCase())
            .map((v) => v.padStart(2, "0"))
            .join();
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
    /**
     * @Name: WHO ELSE
     * @Date: 2020-05-09 13:44:34
     * @LastEditTime: Do not edit
     * @Description: message 提示
     * @param {type} {}
     * @return: {}
     */
    alertMessage(type = "message", message = "", duration = 1500) {
      this.$message({
        duration,
        type,
        message,
      });
    },
  },
};
</script>

//***************************************************************************************/
<style lang="less" scoped>
.upload {
  width: 100%;
  height: 100%;
  padding-top: 150px;
  .button-box {
    margin: 10px;
  }
  .file-box {
    padding: 0;
    text-align: center;
    margin: 10px auto;
    width: 520px;
    line-height: 100px;
    height: 100px;
    box-sizing: border-box;
    border: 1px dashed slateblue;

    .file {
      position: relative;
      display: inline-block;
      background: #d0eeff;
      border: 1px solid #99d3f5;
      border-radius: 4px;
      padding: 4px 12px;
      overflow: hidden;
      color: #1e88c7;
      text-decoration: none;
      text-indent: 0;
      line-height: 20px;
    }
    .file input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
    }
    .file:hover {
      background: #aadffd;
      border-color: #78c3f3;
      color: #004974;
      text-decoration: none;
    }
  }
  .cube-container {
    .cube {
      width: 14px;
      height: 14px;
      line-height: 12px;
      background-color: #eeeeee;
      border: 1px solid pink;
      float: left;
      .success {
        background-color: green;
      }
      .error {
        background-color: red;
      }
      .uploading {
        background-color: blue;
      }
    }
  }
}
</style>
