# Blog Posts

This directory contains all blog posts for the portfolio website. Posts are written in Markdown format and automatically rendered on the blog.

## Creating a New Post

1. Create a new `.md` file in this directory
2. Use a URL-friendly filename (e.g., `my-awesome-post.md`)
3. Add frontmatter at the top of the file
4. Write your content in Markdown below the frontmatter

## Frontmatter Format

```markdown
---
title: "Your Post Title"
date: "2024-02-09"
excerpt: "A brief description of your post (shown in listing)"
author: "Aditya Jariwala"
tags: ["Tag1", "Tag2", "Tag3"]
published: true
coverImage: "/blog-images/my-post-cover.jpg" # Optional
---

Your markdown content starts here...
```

## Frontmatter Fields

- **title** (required): The title of your blog post
- **date** (required): Publication date in YYYY-MM-DD format
- **excerpt** (required): Short description (1-2 sentences) for SEO and post listing
- **author** (optional): Defaults to "Aditya Jariwala"
- **tags** (optional): Array of tags for categorization
- **published** (optional): Set to `false` to hide from blog (defaults to true)
- **coverImage** (optional): Path to cover image in `/public` folder

## Writing Tips

### Headlines

Use standard markdown headers:

```markdown
# H1 - Main Title

## H2 - Section Header

### H3 - Subsection
```

### Code Blocks

```markdown
\`\`\`python
def hello_world():
print("Hello, World!")
\`\`\`
```

### Images

```markdown
![Alt text](/blog-images/my-image.png)
```

### Links

```markdown
[Link text](https://example.com)
```

### Lists

```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Blockquotes

```markdown
> This is a quote
```

### Emphasis

```markdown
**bold text**
_italic text_
`inline code`
```

## SEO Best Practices

1. **Title**: 50-60 characters, include target keyword
2. **Excerpt**: 150-160 characters, compelling summary
3. **Tags**: 3-5 relevant tags for discoverability
4. **Date**: Use actual publication date
5. **Cover Image**: 1200x630px for social media sharing
6. **Content**: 800+ words for better SEO ranking
7. **Headers**: Use H2/H3 to structure content
8. **Links**: Link to relevant internal and external resources

## Example Post Structure

```markdown
---
title: "Building Scalable ML Pipelines with Kubernetes"
date: "2024-02-15"
excerpt: "Learn how to architect production-ready machine learning pipelines using Kubernetes, with real-world examples from processing millions of predictions daily."
author: "Aditya Jariwala"
tags: ["Machine Learning", "Kubernetes", "MLOps", "Cloud Architecture"]
published: true
coverImage: "/blog-images/ml-pipelines-kubernetes.png"
---

# Building Scalable ML Pipelines with Kubernetes

Introduction paragraph...

## The Challenge

Problem description...

## Solution Architecture

### Component 1: Data Ingestion

Details...

### Component 2: Model Training

Details...

## Implementation

\`\`\`python

# Code example

\`\`\`

## Results

Performance metrics...

## Lessons Learned

- Point 1
- Point 2
- Point 3

## Conclusion

Summary...
```

## Publishing Workflow

1. Write your post in markdown
2. Save the file in `content/blog/`
3. Commit and push to GitHub
4. Deploy to production (Vercel auto-deploys)
5. Post will appear at `https://adityajariwala.com/blog/your-post-slug`

## Local Testing

Run the development server to preview your post:

```bash
npm run dev
```

Navigate to `http://localhost:3000/blog` to see your post in the listing.

## Notes

- Posts are sorted by date (newest first)
- Reading time is auto-calculated
- Markdown is converted to styled HTML automatically
- All posts are statically generated for performance
- Sitemap updates automatically with new posts
