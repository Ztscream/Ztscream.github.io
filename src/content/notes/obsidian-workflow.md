---
title: "Obsidian + Enveloppe 一键发布速查笔记"
date: 2026-11-24
topic: "效率与工具"
description: "日常在本地写笔记、贴图并一键推送到 GitHub Pages 的标准操作流。"
tags: ["Obsidian", "GitHub"]
category: notes
share: true
---

这是一篇存放在 `Notes`（学习笔记）板块的示例文档。与按时间流逝的博客不同，学习笔记会按照顶部的 `topic` 属性自动归类到对应的知识专题下。

## 日常发布三步流

1. **新建笔记**：在 Obsidian 中插入预设模板，正常离线写作，截图直接 `Ctrl + V` 粘贴。
2. **选择去向**：在文档顶部可视化属性栏中设置 `category`：
   - 填 `blog` → 自动进入**博客**归档
   - 填 `notes` → 自动进入**学习笔记**（配合 `topic` 归类专题）
   - 填 `memos` → 自动追加到**当下与闪念**时间线
3. **打勾上传**：勾选 `share` 复选框，点击左侧栏 Enveloppe 上传图标，等待约 30 秒 GitHub Actions 自动部署完成。

## 为什么这套流派零心智负担？

> 私密草稿只要不勾选 `share`，就永远只会留在你自己的电脑硬盘里；以后哪篇不想公开了，取消勾选再点同步即可自动从线上移除。
