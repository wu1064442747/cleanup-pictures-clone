"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, ArrowRight, Download, Image as ImageIcon, Move, ZoomIn } from "lucide-react";
import dynamic from "next/dynamic";
import ScrollToTop from "@/components/ScrollToTop";

// Using dynamic import to avoid Canvas-related SSR issues
const TextShapedImageMerge = dynamic(() => import("@/components/TextShapedImageMerge"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bdf60b] mx-auto mb-4"></div>
        <p className="text-gray-500">Editor loading...</p>
      </div>
    </div>
  )
});

export default function ImageMergeApp() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-lg font-semibold text-gray-900">
                Merge Images Together
              </div>
              <Badge variant="secondary" className="ml-2 bg-[#bdf60b] text-black hover:bg-[#bdf60b]/90">
                MVP
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-900 hover:text-gray-700">Features</a>
              <a href="#usecases" className="text-gray-900 hover:text-gray-700">Use Cases</a>
              <a href="#faq" className="text-gray-900 hover:text-gray-700">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create text-shaped <br />
              <span className="bg-[#bdf60b] px-2 py-1 rounded">merge images</span> <br />
              in seconds
            </h1>

            {/* Canvas Editor Component */}
            <TextShapedImageMerge />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#bdf60b] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Simple text-shaped merge images<br />
              <span className="underline">in seconds</span>
            </h2>
            <p className="text-lg text-black/80 mb-12">
              Upload images, enter text, and instantly get a text-shaped image merge
            </p>

            {/* Feature Icons */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-[#bdf60b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Images</h3>
                <p className="text-gray-600">
                  Drag and drop or select multiple images - they will automatically arrange into text shapes
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-[#bdf60b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Move className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Text</h3>
                <p className="text-gray-600">
                  Enter any word or phrase - your images will automatically form this text shape
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-[#bdf60b]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Export and Share</h3>
                <p className="text-gray-600">
                  Download your work as high-quality images, anytime you want to share on social media
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="usecases" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Use Cases</h2>

            {/* Category Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Badge className="bg-black text-white hover:bg-gray-800">Social Media</Badge>
              <Badge className="bg-[#bdf60b] text-black hover:bg-[#bdf60b]/90">Photo Memories</Badge>
              <Badge className="bg-gray-600 text-white hover:bg-gray-700">Name Art</Badge>
              <Badge className="bg-gray-600 text-white hover:bg-gray-700">Creative Project</Badge>
            </div>
          </div>

          {/* Use Case Examples */}
          <div className="space-y-16">
            {/* Social Media */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/4188543113.jpeg"
                  alt="Social media example"
                  className="flex-1 rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Attractive Social Media Content</h3>
                <p className="text-gray-600 mb-4">
                  Turn your photos into "SALE", "NEW" or brand names for eye-catching social media posts.
                </p>
                <p className="text-gray-600">
                  Perfect for marketing professionals and content creators looking to stand out in a crowded information stream.
                </p>
              </div>
            </div>

            {/* Photo Memories */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Photo Memories</h3>
                <p className="text-gray-600 mb-4">
                  Turn your vacation photos, wedding photos, or family memories into meaningful words like "LOVE", "HOME", or special dates.
                </p>
                <p className="text-gray-600">
                  A creative way to showcase multiple photos in a single, meaningful composition.
                </p>
              </div>
              <div className="order-1 md:order-2 flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/20747508.jpeg"
                  alt="Photo memories example"
                  className="flex-1 rounded-lg"
                />
              </div>
            </div>

            {/* Name Art */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex space-x-4">
                <img
                  src="https://ext.same-assets.com/303058917/3764727283.jpeg"
                  alt="Name art example"
                  className="flex-1 rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Name Art</h3>
                <p className="text-gray-600 mb-4">
                  Create custom name art using photos that are meaningful to that person - perfect for birthdays, graduations, or as a unique gift.
                </p>
                <p className="text-gray-600">
                  Use photos from someone's life to spell out their name or special information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">How many images can I upload?</h3>
              <p className="text-gray-600">
                You can upload any number of images. The more images you provide, the more detailed your text merge will be. We recommend at least 5-10 images for best results.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">What text can I use?</h3>
              <p className="text-gray-600">
                You can use any text - single words like "LOVE" or "HOME" work best, but you can also try short phrases or symbols. Both English and other languages are supported.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Will my images be saved on your server?</h3>
              <p className="text-gray-600">
                No, all processing is done directly in your browser. Your images will not be uploaded to our server, ensuring complete privacy.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">What image formats are supported?</h3>
              <p className="text-gray-600">
                You can upload images in JPG, PNG, and GIF formats. The exported image merge will be in high-quality PNG format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#bdf60b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Start Creating Your Text Image Merge Now
          </h2>
          <p className="text-xl text-black/80 mb-8">
            No registration required, free to use, easy to get started
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-6 h-auto">
            Start Using <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Merge Images Together</h3>
            <p className="text-gray-400 mb-4">
              A simple, quick online tool for creating text-shaped image merges.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 Merge Images Together</span>
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
} 