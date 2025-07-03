"use client"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import BlogPostGrid from "../ClubJournal/blog-post-grid"
import FeaturedPosts from "../ClubJournal/comment-section"
import CategoryFilter from "../ClubJournal/category-filter"
// import "../../../Components/ArtClub/ClubJournal/files"
import {
    useRouter 
}
from "next/navigation"
export default function ClubJournal() {
    const router = useRouter()
    const gotoGeneralNewPost = ()=>{
        router.push("../../../Components/ArtClub/ClubJournal/files")
    } 
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Club <span className="text-blue-200">Journal</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Share your artistic journey, creative process, and insights with our community
            </p>
            <span onClick={()=>{
                gotoGeneralNewPost()
            }}>
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 font-medium">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Post
              </Button>
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Featured Posts */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Posts</h2>
        <FeaturedPosts postSlug={""} />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Blog Posts */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
              <CategoryFilter />
            </div>
            <BlogPostGrid />
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-8">
            {/* Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-4">Search Posts</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by keyword..."
                  className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {[
                  { name: "Painting", count: 12 },
                  { name: "Digital Art", count: 8 },
                  { name: "Sculpture", count: 5 },
                  { name: "Photography", count: 10 },
                  { name: "Mixed Media", count: 7 },
                ].map((category) => (
                  <div key={category.name} className="flex justify-between items-center group">
                    <Link
                      href={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-700 hover:text-blue-600 group-hover:translate-x-1 transition-transform duration-200"
                    >
                      {category.name}
                    </Link>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Watercolor",
                  "Portrait",
                  "Abstract",
                  "Landscape",
                  "Tutorial",
                  "Process",
                  "Inspiration",
                  "Technique",
                  "Color Theory",
                  "Composition",
                ].map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag.toLowerCase()}`}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-800 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
