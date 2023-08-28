<template>
  <div class="main">
    <el-container style="border: 1px solid #eee">
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

      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu :default-openeds="['1', '3']">
            <el-submenu index="1">
              <template slot="title"
                ><i class="el-icon-message"></i>导航一</template
              >
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"
                ><i class="el-icon-menu"></i>导航二</template
              >
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="2-4">
                <template slot="title">选项4</template>
                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"
                ><i class="el-icon-setting"></i>导航三</template
              >
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="3-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="3-4">
                <template slot="title">选项4</template>
                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-container>
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

                <!-- <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过 5 MB
              </div> -->
              </el-upload>

              <el-button size="small" type="primary" @click="uploadFile"
                >完整上传</el-button
              >
              <el-button size="small" type="primary" @click="uploadFileChunks"
                >切片上传
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="dynamicChunkFileUpload"
                >慢启动上传
              </el-button>
              <el-progress v-if="file" :percentage="percentage"></el-progress>

              <!--    <div>
              <div v-for="item in imgList" :key="item.name">
                <span>{{ item.name }}</span>
                <el-image
                  fit="cover"
                  style="width: 100px; height: 100px"
                  :src="item.src"
                >
                </el-image>
              </div>
            </div> -->

              <!-- //* 切片-方格进度显示 -->
              <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
                <div class="cube" v-for="chunk in chunks" :key="chunk.name">
                  <div
                    :class="{
                      success: chunk.progress == 100,
                      error: chunk.progress < 0,
                      uploading: chunk.progress > 0 && chunk.progress < 100
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
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
const CHUNK_SIZE = (1 / 16) * 1024 * 1024;
const MAX_SIZE = 5 * 1024 * 1024;
const IMG_WIDTH_LIMIT = 1000;
const IMG_HEIGHT_LIMIT = 1000;
import sparkMD5 from "spark-md5";

export default {
  data() {
    return {
      limit: 3,
      percentage: 0,
      status: null,
      file: null,
      chunks: [],
      fileList: [],
      imgList: []
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
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length) * 16);
    }
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
          type: "warning"
        });
        return;
      }
      const file = this.file;
      const form = new FormData();
      form.append("name", file.name);
      form.append("file", file);
      const res = await this.$http.post("/uploadfile", form, {
        onUploadProgress: progressEvent => {
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
        this.file = null;
        this.fileList = [];
        this.percentage = 0;
        this.imgList.push({
          name: file.name,
          src: "../../server/app" + res.data.data
        });
        this.$message({
          message: res.data.message,
          type: "success"
        });
      } else {
        this.percentage = 0;
        this.$message({
          message: res.data.message,
          type: "error"
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
          type: "warning"
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
      // console.log("完整文件的hash 值", hash);

      const { uploaded, uploadedList } = await this.checkFile(hash);

      if (uploaded) {
        this.fileList = [];
        return;
      }
      chunks = chunks.map((chunk, index) => {
        const name = hash + "-" + index;
        return {
          name, //required  方块进度显示用切片文件命名
          hash, //完整文件的hash 值 ，作为文件夹命名
          chunk: chunk.file,
          index,
          //*判断已经上传的切片,精度条方格显示100%
          progress: uploadedList.indexOf(name) > -1 ? 100 : 0
          // progress: 0, //required  方块进度显示用
        };
      });
      this.chunks = chunks;

      const requests = chunks
        .filter(chunk => uploadedList.indexOf(chunk.name) == -1)
        .map((chunk, index) => {
          const form = new FormData();
          form.append("name", chunk.name);
          form.append("hash", chunk.hash);
          form.append("chunk", chunk.chunk);
          return { form, index: chunk.index, process: 0, errNum: 0 };
        });

      //  TODO 开启 并发数量控制
      await this.sendRequest(requests, 5); //控制并发请求数量
      await this.mergeRequest(this.file, CHUNK_SIZE, hash);

      /*  const requests = chunks
        .map(chunk => {
          const form = new FormData();
          form.append("name", chunk.name);
          form.append("hash", chunk.hash);
          form.append("chunk", chunk.chunk);
          return form;
        })
        // .map((item, index) => {     //  TODO 启动所有任务
        .map(({item, index}) => {     //  TODO 启动所有任务
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
      const that = this;
      return new Promise((resolve, reject) => {
        let counter = 0,
          isStop = false;
        const len = chunks.length;
        const start = async () => {
          if (isStop) {
            return;
          }
          const task = chunks.shift();

          if (task) {
            const { form, index } = task;
            try {
              await this.$http.post("/uploadfilechunks", form, {
                onUploadProgress: progressEvent => {
                  that.chunks[index].progress = (
                    (progressEvent.loaded / progressEvent.total) *
                    100
                  ).toFixed(2);
                }
              });
              if (counter == len - 1) {
                that.percentage = 100;
                resolve();
              } else {
                counter++;
                that.percentage = ((counter / len) * 100).toFixed(2);
                start();
              }
            } catch (error) {
              this.chunks[index].progress = -1;
              if (task.errNum < 3) {
                task.errNum++;
                chunks.unshift(task);
                start();
              } else {
                isStop = true;
                reject("失败了");
                this.$message({
                  message: "重试次数已到三次,上传失败",
                  type: "error"
                });
              }
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

    async isGif(file) {
      const ret = await this.blobToString(file.slice(0, 6));
      const isgif = ret === "47 49 46 38 39 61" || ret === "47 49 46 38 37 61";
      if (isgif) {
        console.log("文件是gif");

        const { w, h } = await this.getRectByOffset(
          file,
          [6, 8],
          [8, 10],
          true
        );
        console.log("gif宽高", w, h);
        if (w > IMG_WIDTH_LIMIT || h > IMG_HEIGHT_LIMIT) {
          this.$message.error(
            "gif图片宽高不得超过！" + IMG_WIDTH_LIMIT + "和" + IMG_HEIGHT_LIMIT
          );
          return false;
        }
      }
      return isgif;
      // 文件头16进制 47 49 46 38 39 61 或者47 49 46 38 37 61
      // 分别仕89年和87年的规范
      // const tmp = '47 49 46 38 39 61'.split(' ')
      //               .map(v=>parseInt(v,16))
      //               .map(v=>String.fromCharCode(v))
      // console.log('gif头信息',tmp)
      // // 或者把字符串转为16进制 两个方法用那个都行
      // const tmp1 = 'GIF89a'.split('')
      //                 .map(v=>v.charCodeAt())
      //                 .map(v=>v.toString(16))
      // console.log('gif头信息',tmp1)

      // return ret ==='GIF89a' || ret==='GIF87a'
      // 文件头标识 (6 bytes) 47 49 46 38 39(37) 61
    },

    /*
      二进制=》ascii码=》转成16进制字符串
      */
    async blobToData(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function() {
          resolve(reader.result);
        };
        reader.readAsBinaryString(blob);
      });
    },

    /*
      二进制=》ascii码=》转成16进制字符串
    */
    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function() {
          const ret = reader.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, "0"))
            .join(" ");
          resolve(ret);
        };
        reader.readAsBinaryString(blob);
      });
    },
    async getRectByOffset(file, widthOffset, heightOffset, reverse) {
      let width = await this.blobToString(file.slice(...widthOffset));
      let height = await this.blobToString(file.slice(...heightOffset));

      if (reverse) {
        width = [width.slice(3, 5), width.slice(0, 2)].join(" ");
        height = [height.slice(3, 5), height.slice(0, 2)].join(" ");
      }
      const w = parseInt(width.replace(" ", ""), 16);
      const h = parseInt(height.replace(" ", ""), 16);
      return { w, h };
    },
    async isPng(file) {
      const ret = await this.blobToString(file.slice(0, 8));
      const ispng = ret === "89 50 4E 47 0D 0A 1A 0A";
      if (ispng) {
        const { w, h } = await this.getRectByOffset(file, [18, 20], [22, 24]);
        console.log("png宽高", w, h);
        if (w > IMG_WIDTH_LIMIT || h > IMG_HEIGHT_LIMIT) {
          this.$message.error(
            "png图片宽高不得超过！" + IMG_WIDTH_LIMIT + "和" + IMG_HEIGHT_LIMIT
          );
          return false;
        }
      }
      return ispng;
    },
    async isJpg(file) {
      const len = file.size;
      const start = await this.blobToString(file.slice(0, 2));
      const tail = await this.blobToString(file.slice(-2, len));
      const isjpg = start === "FF D8" && tail === "FF D9";
      if (isjpg) {
        const heightStart = parseInt("A3", 16);
        const widthStart = parseInt("A5", 16);
        const { w, h } = await this.getRectByOffset(
          file,
          [widthStart, widthStart + 2],
          [heightStart, heightStart + 2]
        );
        console.log("jpg大小", w, h);
      }
      return isjpg;
    },
    isImage(file) {
      return this.isGif(file) && this.isPng(file) && this.isJpg(file);
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
            hash
          })
          .then(res => {
            resolve(res.data);
            this.$message.success("上传成功!");
          });
      });
    },
    handleChange(file, fileList) {
      if (!file.raw) return;

      if (!this.isImage(file.raw)) {
        this.$message.warning("请选择正确的图片格式");
        return;
      }
      if (file.raw.size > MAX_SIZE) {
        this.$message.warning("请选择小于2M的文件");
        return;
      }
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
          )
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
        worker.onmessage = event => {
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
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = e => {
              spark.append(e.target.result);
              resolve();
            };
            reader.onerror = function(err) {
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
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = e => {
              spark.append(e.target.result);
              resolve();
            };
            reader.onerror = function(err) {
              console.warn("reader went wrong.", err);
            };
          });
        }
      });
    },

    async calculateHashSample() {
      return new Promise(resolve => {
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
        reader.onload = e => {
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
        ext: this.file.name.split(".").pop()
      });
      const { uploaded, uploadedList } = res.data.data;
      if (uploaded) {
        this.$message.warning("文件已存在,秒传成功");
      }
      return { uploaded, uploadedList };
    },
    ext(filename) {
      // 返回文件后缀名
      return filename.split(".").pop();
    },
    /*
    动态计算适合网速的切片大小
    */
    async dynamicChunkFileUpload() {
      // @todo数据缩放的比率 可以更平缓
      // @todo 并发+慢启动

      // 慢启动上传逻辑
      const file = this.file;
      if (!file) return;
      const fileSize = file.size;
      let offset = 0.1 * 1024 * 1024;

      let cur = 0;
      let count = 0;
      this.hash = await this.calculateHashSample();

      while (cur < fileSize) {
        const chunk = file.slice(cur, cur + offset);
        cur += offset;
        const chunkName = this.hash + "-" + count;
        const form = new FormData();

        form.append("chunkname", chunkName);
        form.append("ext", this.ext(this.file.name));
        form.append("hash", this.hash);
        form.append("file", chunk);
        // form.append("file", new File([chunk],name,{hash:this.hash,type:'png'}))

        let start = new Date().getTime();
        // await this.$http.post("/upload", form);
        await this.$http.post("/uploadfile", form);
        const now = new Date().getTime();
        const time = ((now - start) / 1000).toFixed(4);

        // 期望10秒一个切片
        let rate = time / 10;
        // 速率有最大和最小 可以考虑更平滑的过滤 比如1/tan
        if (rate < 0.5) rate = 0.5;
        if (rate > 2) rate = 2;
        // 新的切片大小等比变化
        // console.log(
        //   `切片${count}大小是${this.format(
        //     offset
        //   )},耗时${time}秒，是30秒的${rate}倍，修正大小为${this.format(
        //     offset / rate
        //   )}`
        // );
        offset = parseInt(offset / rate);
        // if(time)
        count++;
      }
      await this.mergeRequest(this.file, CHUNK_SIZE, this.hash);
    }
  }
};
</script>

<style lang="less">
.main {
  height: 100%;
  width: 100%;
  .el-container {
    height: 100%;
  }
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
