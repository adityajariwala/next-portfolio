import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import Button from "@/components/ui/Button";

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Aditya Jariwala`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/blog" className="inline-block mb-8">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Back to Blog
          </Button>
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            {post.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-wrap gap-4 text-dark-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{post.readingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>By {post.author}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Tag size={18} className="text-neon-purple" />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-dark-700 text-neon-purple rounded hover:bg-dark-600 hover:text-neon-cyan transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-dark-200 mt-6 leading-relaxed border-l-4 border-neon-cyan pl-6">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-neon-cyan prose-headings:font-bold
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-dark-200 prose-p:leading-relaxed
            prose-a:text-neon-cyan prose-a:no-underline hover:prose-a:text-neon-pink
            prose-strong:text-dark-50 prose-strong:font-bold
            prose-code:text-neon-purple prose-code:bg-dark-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-dark-800 prose-pre:border prose-pre:border-dark-700
            prose-blockquote:border-l-4 prose-blockquote:border-neon-cyan prose-blockquote:pl-6 prose-blockquote:italic
            prose-ul:text-dark-200 prose-ol:text-dark-200
            prose-li:text-dark-200
            prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-dark-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/blog">
              <Button variant="cyber" className="flex items-center gap-2">
                <ArrowLeft size={20} />
                Back to All Posts
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link href="/contact">
                <Button variant="secondary">Get in Touch</Button>
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
