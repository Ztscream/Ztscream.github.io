---
title: "从零构建极简个人数字主场：Obsidian 与 Astro 的无感同步"
date: 2026-11-24
description: "为什么我放弃繁琐的手动构建，转而采用杂志极简风布局与 Obsidian 单篇一键发布工作流。"
tags: ["建站", "极简主义", "工作流"]
category: blog
share: true
---

过去维护静态博客最大的阻力往往不在“写”，而在“发”——要在不同文件夹之间拷贝 `.md`、手动搬运截图改路径、再打开终端敲一串构建命令。一旦流程繁琐，记录的热情就会迅速消退。

这次重建个人网站，我把核心目标收敛为两件事：**耐看的极简排版**，以及 **2 秒完成的无感同步**。

## 内容的三层结构

为了兼顾不同颗粒度的表达，全站将文字划分为三个互不干扰的模块：

1. **博客（Blog）**：按年份与时间流归档，存放有完整上下文的思考、总结与技术复盘。
2. **学习笔记（Notes）**：按主题（`topic`）聚合成树状目录，允许未完待续、持续修订。
3. **当下与闪念（Now & TIL）**：记录近期关注的重点，以及日常遇到的三五行小技巧。

## 排版与技术能力验证

代码块内置了双主题高亮（Vitesse Light / Dark）与悬浮一键复制：

```typescript
interface NoteFrontmatter {
  title: string;
  category: 'blog' | 'notes' | 'memos';
  topic?: string;
  share: boolean;
}

export function canPublish(meta: NoteFrontmatter): boolean {
  return meta.share === true;
}
```

对于算法与理工科笔记，原生支持行内公式（如时间复杂度与欧拉恒等式 $e^{i\pi} + 1 = 0$）以及独立公式块：

$$
\mathcal{L}(\theta) = -\frac{1}{N} \sum_{i=1}^{N} \left[ y_i \log \hat{y}_i + (1 - y_i) \log(1 - \hat{y}_i) \right]
$$

接下来，只需专注于在本地安静地写下每一篇值得留存的内容。
