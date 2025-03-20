import Image from "next/image";
import Link from "next/link";

export default function FeaturePage() {
  const features = [
    {
      title: "Server Components",
      description: "React Server Components allow you to write UI that can be rendered and optionally cached on the server.",
      icon: "🔄"
    },
    {
      title: "Data Fetching",
      description: "Next.js extends the capabilities of React by allowing you to fetch data for your pages.",
      icon: "📊"
    },
    {
      title: "CSS Support",
      description: "Next.js has built-in support for CSS, SASS, CSS Modules, and Tailwind CSS.",
      icon: "🎨"
    },
    {
      title: "Image Optimization",
      description: "Next.js Image component optimizes images for performance automatically.",
      icon: "🖼️"
    },
    {
      title: "Performance Metrics",
      description: "Real-time performance analytics to ensure your site is always fast and responsive.",
      icon: "📈"
    },
    {
      title: "International Routing",
      description: "Support for internationalized (i18n) routing in Next.js applications.",
      icon: "🌐"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <Link href="/">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={25}
                priority
              />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
              <Link href="/feature" className="font-medium text-indigo-600 dark:text-indigo-400">Features</Link>
              <Link href="https://nextjs.org/docs" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">Docs</Link>
              <Link href="https://github.com/vercel/next.js" className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition">GitHub</Link>
            </nav>
          </div>
          
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Powerful Features
            </span>
          </h1>
          <p className="text-center text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Next.js provides a range of powerful features to help you build modern, high-performance web applications.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center bg-indigo-600 dark:bg-indigo-800 rounded-xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-6 text-indigo-100">
              Start building amazing web applications with Next.js today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://nextjs.org/docs/getting-started" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-medium hover:bg-gray-100 transition"
              >
                Get Started
              </a>
              <a 
                href="https://nextjs.org/learn" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-white font-medium hover:bg-indigo-700 transition"
              >
                Learn Next.js
              </a>
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-16">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
                className="dark:invert"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Powered by Vercel
              </span>
            </div>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Back to Home
              </Link>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                href="https://vercel.com/templates"
                target="_blank"
                rel="noopener noreferrer"
              >
                Templates
              </a>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}