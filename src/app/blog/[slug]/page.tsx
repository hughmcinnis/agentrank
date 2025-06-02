import { blogPosts } from '@/data/blog-posts';
import { getRelatedPosts, formatDate, processMarkdownContent } from '@/lib/blog-utils';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface BlogPostPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const post = blogPosts.find((post) => post.slug === params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishDate,
            authors: [post.author],
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const post = blogPosts.find((post) => post.slug === params.slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(post, blogPosts);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
            >
                ← Back to Blog
            </Link>

            <article>
                {post.featuredImage && (
                    <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <header className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map((category) => (
                            <Link
                                key={category}
                                href={`/blog?category=${encodeURIComponent(category)}`}
                                className="text-sm font-semibold bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center gap-6 text-gray-600">
                        <span>{post.author}</span>
                        <span>{formatDate(post.publishDate)}</span>
                    </div>
                </header>

                <div className="prose prose-lg max-w-none mb-12 dark:prose-invert">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={{
                            h1: ({ ...props }) => <h1 className="text-4xl font-bold mb-8" {...props} />,
                            h2: ({ ...props }) => <h2 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                            h3: ({ ...props }) => <h3 className="text-2xl font-semibold mt-8 mb-4" {...props} />,
                            p: ({ ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
                            ul: ({ ...props }) => <ul className="mb-6 list-disc pl-6" {...props} />,
                            ol: ({ ...props }) => <ol className="mb-6 list-decimal pl-6" {...props} />,
                            li: ({ ...props }) => <li className="mb-2" {...props} />,
                            a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                            code: ({ inline, ...props }) =>
                                inline ? (
                                    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props} />
                                ) : (
                                    <code className="block bg-gray-100 dark:bg-gray-800 rounded p-4 mb-4" {...props} />
                                ),
                            blockquote: ({ ...props }) => (
                                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6" {...props} />
                            )
                        }}
                    >
                        {processMarkdownContent(post.content)}
                    </ReactMarkdown>
                </div>

                <footer className="border-t pt-8">
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/blog?tag=${encodeURIComponent(tag)}`}
                                className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                </footer>
            </article>

            {relatedPosts.length > 0 && (
                <section className="mt-12 border-t pt-8">
                    <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedPosts.map((relatedPost) => (
                            <Link
                                key={relatedPost.id}
                                href={`/blog/${relatedPost.slug}`}
                                className="group"
                            >
                                <article className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow">
                                    {relatedPost.featuredImage && (
                                        <div className="relative h-40">
                                            <Image
                                                src={relatedPost.featuredImage}
                                                alt={relatedPost.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {relatedPost.excerpt}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
} 