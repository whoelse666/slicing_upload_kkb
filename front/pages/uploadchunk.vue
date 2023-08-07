<template>
  <div>
    <el-container style="height: 500px; border: 1px solid #eee">
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
          <span>王小虎</span>
        </el-header>

        <el-main>
          <div class="upload_box">
            <el-upload
              drag
              action=""
              :auto-upload="false"
              class="upload-demo"
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

            <el-button size="small" type="success" @click="submitUpload"
              >上传到服务器</el-button
            >
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
const CHUNK_SIZE = 1024 * 1024 * (1 / 6);

export default {
  data() {
    return {
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        // },
      ],
    };
  },
  methods: {
    submitUpload(data, config) {
      // this.$refs.upload.submit();
    },
    handleChange(file, fileList) {
      console.log("file===", file, fileList);

      this.chunkFile(file, CHUNK_SIZE);
    },

    chunkFile(file, size = CHUNK_SIZE) {


    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
  },
};
</script>

<style lang="less">
.upload_box {
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
