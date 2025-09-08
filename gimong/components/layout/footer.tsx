import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-6 text-sm text-gray-600">
        <p>LA TRINIDAD COMMUNITY OF BELIEVERS © GIMONG {new Date().getFullYear()} | All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <Link href="/login" className="text-gray-700 hover:text-gray-900">
            Login
          </Link>
        </div>
      </div>
    </footer>
  )
}
