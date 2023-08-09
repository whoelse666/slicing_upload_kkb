<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>风浪越大鱼越贵</span>
        </el-header>
        <el-main>
          <div class="upload_box">
            <el-upload
              :limit="limit"
              drag
              action=""
              :auto-upload="false"
              class="upload-demo"
              :on-exceed="handleExceed"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :file-list="fileList"
              list-type="picture"
              accept="image/png, image/jpeg,image/jpg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>

              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>

            <el-button size="small" type="primary" @click="uploadFile"
              >完整上传</el-button
            >
            <el-button size="small" type="primary" @click="uploadFileChunks"
              >切片上传
            </el-button>
            <el-progress v-if="file" :percentage="percentage"></el-progress>

            <div>
              <div v-for="item in imgList" :key="item.name">
                <span>{{ item.name }}</span>
                <el-image
                  fit="cover"
                  style="width: 100px; height: 100px"
                  :src="item.src"
                >
                </el-image>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
const CHUNK_SIZE = (1 / 16) * 1024 * 1024;
import sparkMD5 from "spark-md5";

export default {
  data() {
    return {
      limit: 3,
      percentage: 0,
      status: null,
      file: null,
      chunks: [],
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
      imgList: [],
    };
  },
  methods: {
    /**
     * 上传文件
     * @param file 文件
     * @return: null
     */
    async uploadFile() {
      if (!this.file) {
        this.$message({
          message: "请选择一个文件!",
          type: "warning",
        });
        return;
      }
      const file = this.file;
      const form = new FormData();
      form.append("name", file.name);
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
        this.file = null;
        this.fileList = [];
        this.percentage = 0;
        this.imgList.push({
          name: file.name,
          src: "../../server/app" + res.data.data,
        });
        this.$message({
          message: res.data.message,
          type: "success",
        });
      } else {
        this.percentage = 0;
        this.$message({
          message: res.data.message,
          type: "error",
        });
      }
    },

    /**
      切片上传
     * @param file 文件
     * @return: null
     */
    async uploadFileChunks() {
      if (!this.file) {
        this.$message({
          message: "请选择一个文件!",
          type: "warning",
        });
        return;
      }
      const file = this.file;
      let chunks = this.createChunkFile(file);
      //完整文件的hash 值
      const hash = await this.calcuateHashIdle(chunks);

      const uploaded = await this.checkFile(hash);

      if (uploaded) {
        this.fileList = [];
        return;
      }
      // const hash = sparkMD5.hash("whoelse");  // 测试
      chunks = chunks.map((chunk, index) => {
        return {
          name: hash + "-" + index, //required  方块进度显示用切片文件命名
          hash, //完整文件的hash 值 ，作为文件夹命名
          chunk: chunk.file,
          //*判断已经上传的切片,精度条方格显示100%
          // progress: uploaddedList.indexOf(name) > -1 ? 100 : 0,
          progress: 0, //required  方块进度显示用
        };
      });
      this.chunks = chunks;

      const requests = chunks
        .map((chunk) => {
          const form = new FormData();
          form.append("name", chunk.name);
          form.append("hash", chunk.hash);
          form.append("chunk", chunk.chunk);
          return form;
        })
        .map((item) => {
          const res = this.$http.post("/uploadfilechunks", item, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.loaded < progressEvent.total) {
                this.percentage =
                  (progressEvent.loaded / progressEvent.total) * 100;
              } else {
                this.percentage = 100;
                this.status = "success";
              }
            },
          });
          return res;
        });


      Promise.all(requests).then(async (res) => {
        console.log(" Promise.all", res);
        if (res[0].data.code == -1) {
          // 判断是否已存在
          return this.$message({
            message: res[0].data.message,
            type: "warning",
          });
        }
        const ret = await this.mergeRequest(this.file, CHUNK_SIZE, hash);
          this.fileList = [];
        this.file = "";
      });
    },
    /**
     * @name: 合并切片文件
     * @param {type} {file,size,hash}
     * @return: null
     */
    async mergeRequest(file, size = CHUNK_SIZE, hash) {
      console.log("mergefile  file", file);
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
    handleChange(file, fileList) {
      console.log("file===", file, fileList);
      this.file = file.raw; // file.raw是二进制
    },

    /*
    创建文件切片数组
    * file 文件;
    * chunkSize 切片大小
    */
    createChunkFile(file, chunkSize = CHUNK_SIZE) {
      if (!file) return;
      const chunks = [],
        chunkCount = Math.ceil(file.size / chunkSize);
      let start = 0;
      for (let i = 0; i < chunkCount; i++) {
        chunks.push({
          index: start,
          file: file.slice(
            start,
            start + chunkSize > file.size ? file.size : start + chunkSize
          ),
        });
        start += chunkSize;
      }
      console.log("chunks===", chunks);
      return chunks;
    },

    /*
   计算文件切片hash
    * chunks 切片数组;
    */
    async calcuateHashIdle(chunks) {
      return new Promise((resolve, reject) => {
        const spark = new sparkMD5.ArrayBuffer();
        let count = 0;

        workLoop();
        async function workLoop() {
          while (count < chunks.length) {
            await appendToSpark(chunks[count].file);
            count++;
            if (count >= chunks.length) {
              resolve(spark.end());
            }
          }
        }
        async function appendToSpark(file) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
              spark.append(e.target.result);
              resolve();
            };
            reader.onerror = function (err) {
              console.warn("reader went wrong.", err);
            };
          });
        }
      });
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件 `);
    },
    handlePreview(file) {
      console.log(file);
    },

    async checkFile(hash) {
      const res = await this.$http.post("/checkfile", {
        hash,
        ext: this.file.name.split(".").pop(),
      });
      const { uploaded, uploadedList } = res.data.data;
      if (uploaded) {
        this.$message.warning("文件已存在,秒传成功");
      }
      return uploaded;
    },
    /*


    */
  },
};
</script>

<style lang="less">
.upload_box {
  padding: 20px;
  width: 500px;
  // height: 500px;
  border: 1px pink solid;
  border-radius: 10px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
</style>
