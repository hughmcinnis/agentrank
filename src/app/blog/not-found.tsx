import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Post Not Found</h2>
            <p className="text-gray-600 mb-8">Sorry, the blog post you're looking for doesn't exist.</p>
            <Link
                href="/blog"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Return to Blog
            </Link>
        </div>
    );
} 