export const SITE = {
  title: 'Ztscream',
  subtitle: '记录思考、体系化学习与日常闪念',
  description: 'Ztscream 的个人数字花园：博客文章、学习笔记与当下记录。',
  author: 'Ztscream',
  url: 'https://ztscream.github.io',
  github: 'https://github.com/Ztscream',
  email: '', // 可填入 mailto:xxx@example.com
  nav: [
    { label: 'Blog', title: '博客', href: '/blog' },
    { label: 'Notes', title: '笔记', href: '/notes' },
    { label: 'Now', title: '当下', href: '/now' },
  ],
  now: {
    updatedAt: '2026-11',
    location: 'China',
    items: [
      { label: '正在搭建', text: '基于 Astro + Obsidian 打造极简个人数字主场，打通本地笔记一键同步工作流。' },
      { label: '持续学习', text: '沉淀底层技术、工程实践与结构化读书笔记。' },
      { label: '阅读与输入', text: '保持克制的信息摄入，多写长文总结与碎片闪念（TIL）。' },
    ],
  },
  // Giscus 评论配置（基于你的仓库 Ztscream/Ztscream.github.io，开启仓库 Discussions 后填入 categoryId 即可生效）
  giscus: {
    enabled: true,
    repo: 'Ztscream/Ztscream.github.io' as `${string}/${string}`,
    repoId: 'R_kgDOV5xRzQ',
    category: 'Announcements',
    categoryId: '', // 在 https://giscus.app 选择仓库与分类后填入 DIC_... 即可自动激活评论区
    mapping: 'pathname',
    lang: 'zh-CN',
  },
};
