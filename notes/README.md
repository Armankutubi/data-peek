# data-peek Notes & Blog Posts

This folder is the single source of truth for technical notes and blog posts. Files with `published: true` in frontmatter are automatically served on the website's blog.

## Published Posts

| File | Topic |
|------|-------|
| [building-ai-sql-assistant.mdx](./building-ai-sql-assistant.mdx) | Building the AI SQL Assistant |
| [ai-assistant-deep-dive.mdx](./ai-assistant-deep-dive.mdx) | Technical deep dive into AI components |
| [query-performance-analyzer.mdx](./query-performance-analyzer.mdx) | Query Performance Analyzer with EXPLAIN |

## Creating a New Post

1. Create a new `.mdx` file in this folder
2. Add frontmatter at the top:

```yaml
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
date: "YYYY-MM-DD"
author: "Rohith Gilla"
tags: ["Tag1", "Tag2"]
published: true  # Set to false to keep as draft
---
```

3. Write your content in MDX (Markdown + JSX)
4. The post will appear on `/blog` when `published: true`

## Draft Posts

Set `published: false` in frontmatter to keep a post as a draft. It won't appear on the blog until you change it to `true`.

## Future Topics

- [ ] Electron + React architecture patterns
- [ ] Multi-database adapter pattern
- [ ] Building a table designer with DDL generation
- [ ] Monaco editor integration tips
- [ ] ERD visualization with React Flow
