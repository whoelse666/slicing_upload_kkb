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
  mounted() {
    // var f = ["🌑", "🌒", "🌓", "🌔", "🌝", "🌖", "🌗", "🌘"];
    // function loop() {
    //   location.hash =
    //     "/uploadchunk?icon=" + f[Math.floor((Date.now() / 100) % f.length)];
    //   setTimeout(loop, 50);
    // }
    // loop();
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
      // const hash = await this.calcuateHashWorker(chunks); //WebWork 计算
      const hash = await this.calculateHashSample(chunks); //优化 抽样计算hash

      // const hash = await this.calcuateHash(chunks);
      // const hash = await this.calcuateHashIdle(chunks);
      // const hash = sparkMD5.hash("whoelse");  // 测试
      console.log("完整文件的hash 值", hash);

      const uploaded = await this.checkFile(hash);

      if (uploaded) {
        this.fileList = [];
        return;
      }
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

      const requests = chunks.map((chunk, index) => {
        const form = new FormData();
        form.append("name", chunk.name);
        form.append("hash", chunk.hash);
        // form.append("index", chunk.index);
        form.append("chunk", chunk.chunk);
        return { form, index: chunk.index };
      });

      //  TODO 开启 并发数量控制
      await this.sendRequest(requests, 3); //控制并发请求数量
      await this.mergeRequest(this.file, CHUNK_SIZE, hash);

      /*  const requests = chunks
        .map(chunk => {
          const form = new FormData();
          form.append("name", chunk.name);
          form.append("hash", chunk.hash);
          form.append("chunk", chunk.chunk);
          return form;
        })
        .map((item, index) => {     //  TODO 启动所有任务
          const res = this.$http.post("/uploadfilechunks", item, {
            onUploadProgress: progressEvent => {
              this.chunks[index].progress = (
                (progressEvent.loaded / progressEvent.total) *
                100
              ).toFixed(2);
            }
          });
          return res;
        });
      //  TODO没有开启 并发数量控制
      Promise.all(requests).then(async res => {
        if (res[0].data.code == -1) {
          // 判断是否已存在
          return this.$message({
            message: res[0].data.message,
            type: "warning"
          });
        }
        await this.mergeRequest(this.file, CHUNK_SIZE, hash);
        this.file = "";
      }); */
    },

    /**
     * @name: 控制并发请求数量
     * @param {type} {chunks,limit = 3}
     * @return: null
     */
    sendRequest(chunks, limit = 3) {
      console.log(" sendRequest(chunks", chunks);
      return new Promise((resolve, reject) => {
        let counter = 0;
        const len = chunks.length;
        const start = async () => {
          const task = chunks.shift();

          if (task) {
            const { form, index } = task;
            console.log("form", form);
            await this.$http.post("/uploadfilechunks", form, {
              // onUploadProgress: progressEvent => {
              //   this.chunks[index].progress = (
              //     (progressEvent.loaded / progressEvent.total) *
              //     100
              //   ).toFixed(2);
              // }
            });
            if (counter == len - 1) {
              resolve();
            } else {
              counter++;
              start();
            }
          }
        };
        //*控制启动limit个任务
        while (limit > 0) {
          // 模拟延迟
          setTimeout(() => start(), Math.random() * 2000);
          limit--;
        }
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
          .post(
            "/mergefile",
            {
              ext: file.name.split(".").pop(),
              size,
              hash,
            },
            {
              onUploadProgress: (progressEvent) => {
                if (progressEvent.loaded < progressEvent.total) {
                  this.percentage =
                    (progressEvent.loaded / progressEvent.total) * 100;
                } else {
                  this.percentage = 100;
                  this.status = "success";
                }
              },
            }
          )
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
      return chunks;
    },

    /*
   WebWork 计算文件切片hash
    * chunks 切片数组;
    */
    async calcuateHashWorker(chunks) {
      return new Promise((resolve, reject) => {
        const worker = new Worker("./workerHash.js");
        worker.postMessage({ chunks });
        worker.onmessage = (event) => {
          const { hash, progress } = event.data;
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    /*
   计算文件切片hash
    * chunks 切片数组;
    */
    async calcuateHash(chunks) {
      return new Promise((resolve, reject) => {
        const spark = new sparkMD5.ArrayBuffer();
        let count = 0;

        workLoop(workLoop);
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

    // window.requestIdleCallback
    /*  const closeId =  window.requestIdleCallback() 方法插入一个函数，这个函数将在浏览器空闲时期被调用 ,closeId可以把它传入 Window.cancelIdleCallback() 方法来结束回调。 */
    async calcuateHashIdle(chunks) {
      return new Promise((resolve, reject) => {
        const spark = new sparkMD5.ArrayBuffer();
        let count = 0;
        window.requestIdleCallback(workLoop);
        async function workLoop(deadline) {
          console.warn("deadline", deadline);
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            await appendToSpark(chunks[count].file);
            count++;
            if (count >= chunks.length) {
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop);
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

    async calculateHashSample() {
      return new Promise((resolve) => {
        const spark = new sparkMD5.ArrayBuffer();
        const reader = new FileReader();
        const file = this.file;
        const size = file.size;
        const offset = 2 * 1024 * 1024;
        // 第一个2M，最后一个区块数据全要
        let chunks = [file.slice(0, offset)];
        let cur = offset;
        /*    while (cur < size) {
          if (cur + offset >= size) {
            //  最后一个区快
            // chunks.push(file.slice(cur, cur + offset));
            chunks.push(file.slice(cur, size));
          } else {
            // 中间的区块
            const mid = cur + offset / 2;
            const end = cur + offset;
            chunks.push(file.slice(cur, cur + 2));
            chunks.push(file.slice(mid, mid + 2));
            chunks.push(file.slice(end - 2, end));
          }
          cur += offset;
        } */
        const mid = size / 2;
        chunks.push(file.slice(mid - offset / 2, mid + offset / 2));
        chunks.push(file.slice(size - offset, size));

        //中间的，取前中后各2各字节
        reader.readAsArrayBuffer(new Blob(chunks));
        reader.onload = (e) => {
          spark.append(e.target.result);
          this.hashProgress = 100;
          resolve(spark.end());
        };
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
