"use client"

import { useState } from "react"
import PhotoUploader from "@/components/photo-uploader"
import PhotoGallery from "@/components/photo-gallery"
import { Separator } from "@/components/ui/separator"
import { Heart, Camera, Sparkles } from "lucide-react"

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePhotosUploaded = () => {
    // Galeriyi yenile
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className={`absolute text-pink-300 opacity-30 animate-float-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 py-8 px-4">
        <header className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="text-yellow-400 w-8 h-8 animate-pulse" />
            <Camera className="text-pink-400 w-10 h-10" />
            <Sparkles className="text-yellow-400 w-8 h-8 animate-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight mb-4 animate-gradient">
            İbrahim & Zeynep
          </h1>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-pink-400"></div>
            <Heart className="text-pink-400 w-6 h-6 animate-pulse" />
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-pink-400"></div>
          </div>

          <p className="text-2xl md:text-3xl text-gray-200 font-light mb-4">Düğün Anıları</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            En özel günümüzden unutulmaz karelerinizi bizimle paylaşın!
            <br />
            Her fotoğraf, aşkımızın hikayesinin bir parçası ✨
          </p>
        </header>

        <main className="container mx-auto space-y-20">
          <section id="upload-section" className="animate-fade-in-up animation-delay-500">
            <PhotoUploader onPhotosUploaded={handlePhotosUploaded} />
          </section>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-4xl">
              <Separator className="bg-gradient-to-r from-transparent via-pink-400 to-transparent h-0.5" />
            </div>
          </div>

          <section id="gallery-section" className="animate-fade-in-up animation-delay-1000">
            <PhotoGallery refreshTrigger={refreshTrigger} />
          </section>
        </main>

        <footer className="text-center mt-20 py-8 border-t border-gray-700/50">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="text-pink-400 w-5 h-5" />
            <span className="text-gray-300">Made with love</span>
            <Heart className="text-pink-400 w-5 h-5" />
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} İbrahim & Zeynep. Tüm anılar sonsuza dek saklı kalacak.
          </p>
        </footer>
      </div>
    </div>
  )
}
