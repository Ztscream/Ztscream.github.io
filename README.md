# Ztscream.github.io

极简杂志风个人数字主场，基于 **Astro 5** 构建，配合 **Obsidian + Enveloppe** 实现本地离线写作与单篇一键同步发布。

## 目录与模块说明

- `src/site.config.ts`：全站个人信息、「当下状态（Now）」及 Giscus 评论参数集中配置
- `src/content/blog/`：博客文章（按年份归档）
- `src/content/notes/`：体系化学习笔记（按 `topic` 主题分组 + 标签筛选）
- `src/content/memos/`：当下与碎片闪念（`/now` 时间轴直接渲染）
- `obsidian-kit/`：开箱即用的 Obsidian 笔记模板与 Enveloppe 插件一键导入配置

## 本地开发命令

```bash
npm run dev      # 启动本地开发预览 (http://localhost:4321)
npm run build    # 构建静态站点至 dist/
npm run preview  # 预览构建产物
```

## 对接 Obsidian 一键发布（3 分钟配完）

1. **复制模板**：将 `obsidian-kit/templates/` 下的 3 个模板文件放入你本地 Obsidian 笔记库的 `_templates` 目录，并在 Obsidian `核心插件 -> 模板` 中指向该目录。
2. **导入 Enveloppe 配置**：
   - 在 Obsidian 中安装启用社区插件 **Enveloppe**。
   - 打开 Enveloppe 设置页顶部，点击 **Import settings（导入配置）**，选择本项目的 `obsidian-kit/enveloppe-preset.json`。
   - 在 `GitHub Configuration` 中填入你的 **GitHub Personal Access Token**（对 `Ztscream/Ztscream.github.io` 仓库开启 `Contents: Read and write` 权限），点击 **Test connection** 验证连通。
3. **日常一键发文章**：
   - 写完笔记后，将顶部属性 `share` 勾选为 `[x]`，设置 `category` 为 `blog`、`notes` 或 `memos`。
   - 点击左侧栏 Enveloppe 上传图标，GitHub Actions 会在约 30~40 秒内自动编译并更新 `https://ztscream.github.io`！

## 开启 Giscus 评论区（可选）

1. 打开仓库 `https://github.com/Ztscream/Ztscream.github.io/settings` -> 勾选开启 **Discussions**。
2. 安装 [Giscus GitHub App](https://github.com/apps/giscus) 并授权该仓库。
3. 在 [giscus.app](https://giscus.app/zh-CN) 输入 `Ztscream/Ztscream.github.io`，选择 `Announcements` 分类，复制页面下方生成的 `data-category-id`（`DIC_...`），填入 `src/site.config.ts` 的 `giscus.categoryId` 中即可生效。
