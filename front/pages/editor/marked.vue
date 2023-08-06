<!--
 * @Author: RONGWEI PENG
 * @Date: 2020-05-04 16:57:18
 * @LastEditors: Do not edit
 * @LastEditTime: 2020-05-13 20:55:54
 * @FilePath: \my__kkb__project\front\pages\editor\marked.vue
 -->

<template>
  <div>
    <div class="write-btn">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <textarea
          ref="editor"
          name=""
          class="md-editor"
          :value="content"
          @input="update"
        ></textarea>
      </el-col>
      <el-col :span="12">
        <div class="md-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from "marked";
import "highlight.js/styles/github.css"; //github样式
// import hljs from "highlight.js"; //全部映入
import hljs from "highlight.js/lib/core"; //按需局部映入
// import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/monokai-sublime.css"; //monokai-sublime样式
export default {
  name: "markdown",
  data() {
    return {
      content: `
# markdown
*  吃饭
*  睡觉
*  打元宝
\`\`\`javascript
    let a = 1
    console.log(a)
    mounted() {
    this.timer = null;
    this.bindEvents();
    marked.setOptions({
    rendered: new marked.Renderer(),
      hightLight(code) {
        return hljs.highlightAuto(code).value;
      }
    });
  }
\`\`\`
`
    };
  },
  computed: {
    compiledContent() {
      return marked(this.content);
    }
  },
  mounted() {
    this.timer = null;
    this.bindEvents();

    marked.setOptions({
      rendered: new marked.Renderer(),
      highlight(code) {
        return hljs.highlightAuto(code).value;
      },
    });
  },
  methods: {
    bindEvents() {
      this.$refs.editor.addEventListener("paste", async e => {
        // if (!(e.clipboardData && e.clipboardData.items)) {
        //   return;
        // }
        const files = e.clipboardData.files;
        console.log("files", files);
      });
      this.$refs.editor.addEventListener("drop", async e => {
        const files = e.dataTransfer.files;
        console.log("files", files);
        e.preventDefault();
      });
    },
    update(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.content = e.target.value;
      }, 350);
    },
    submit() {
      console.log("submit");
    }
  }
};
</script>

<style lang="less" scoped>
.md-editor {
  margin: 0;
  padding: 5px;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid peru;
}
.write-btn {
  position: fixed;
  right: 30px;
  top: 10px;
  z-index: 100;
}
</style>
