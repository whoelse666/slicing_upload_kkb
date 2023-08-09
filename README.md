# slicing_upload_kkb
Vue2.x + Eggjs 简单的切片传



 

```js
feat: 新功能、新特性（feature）
fix: 修补bug
perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）
docs: 文档（documentation）
style:格式（不影响代码运行的变动）
refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
revert: 撤销，版本回退
test：测试
improvement: 改进
release: 发布新版本
workflow: 工作流相关文件修改
chore:其他修改（不在上述类型中的修改）
build: 打包，影响项目构建或依赖项修改
ci: 持续集成
```

fix(DAO): fixed invalid user table indexes.
<提交类型>[(影响范围)]: <本次提交描述> <(禅道号或 bug 号)>
<type>(<scope>): <subject>
即
<类型>(<范围>): <具体描述>
常见的提交类型包括：

feat：新增功能
fix：bug 修复
docs：文档更新
style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
refactor：重构代码(既没有新增功能，也没有修复 bug)
perf：性能, 体验优化
test：新增测试用例或是更新现有测试
build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
chore：不属于以上类型的其他类，比如构建流程, 依赖管理
revert：回滚某个更早之前的提交