import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import Button from "@/components/ui/Button";
import { BlogPostStructuredData } from "@/components/StructuredData";

// Generate static params for published blog posts only
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
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

  if (!post || !post.published) {
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
      <BlogPostStructuredData
        title={post.title}
        description={post.excerpt}
        datePublished={post.date}
        dateModified={post.date}
        author={post.author}
        url={`https://adityajariwala.com/blog/${slug}`}
        image={post.coverImage}
      />
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
            <Image
              src={post.coverImage}
              alt={post.title}
              width={896}
              height={504}
              className="w-full h-full object-cover"
            />
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
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-dark-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link href="/blog">
              <Button variant="accent" className="flex items-center gap-2">
                <ArrowLeft size={20} />
                Back to All Posts
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link href="/#contact">
                <Button variant="secondary">Get in Touch</Button>
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
