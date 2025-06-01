"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Heart, Download, User, Calendar, X, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

interface Photo {
  id: string
  fileName: string
  uploaderName: string
  uploadedAt: string
  path: string
}

interface PhotoGalleryProps {
  refreshTrigger?: number
}

export default function PhotoGallery({ refreshTrigger }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set())

  // Demo fotoğrafları
  const demoPhotos: Photo[] = [
    {
      id: "demo1",
      fileName: "düğün-çekimi-1.jpg",
      uploaderName: "Ahmet Yılmaz",
      uploadedAt: "2024-01-15T14:30:00.000Z",
      path: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "demo2",
      fileName: "gelin-damat.jpg",
      uploaderName: "Fatma Demir",
      uploadedAt: "2024-01-15T15:45:00.000Z",
      path: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "demo3",
      fileName: "düğün-salonu.jpg",
      uploaderName: "Mehmet Kaya",
      uploadedAt: "2024-01-15T16:20:00.000Z",
      path: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "demo4",
      fileName: "pasta-kesimi.jpg",
      uploaderName: "Ayşe Özkan",
      uploadedAt: "2024-01-15T17:10:00.000Z",
      path: "/placeholder.svg?height=400&width=400",
    },
  ]

  const loadPhotos = () => {
    setLoading(true)

    // LocalStorage'dan fotoğrafları al
    const savedPhotos = JSON.parse(localStorage.getItem("wedding-photos") || "[]")

    // Demo fotoğrafları ile birleştir
    const allPhotos = [...demoPhotos, ...savedPhotos]

    // Tarihe göre sırala (en yeniden en eskiye)
    allPhotos.sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })

    setTimeout(() => {
      setPhotos(allPhotos)
      setLoading(false)
    }, 1000) // Simüle edilmiş yükleme süresi
  }

  useEffect(() => {
    loadPhotos()
  }, [refreshTrigger])

  const toggleLike = (photoId: string) => {
    setLikedPhotos((prev) => {
      const newLiked = new Set(prev)
      if (newLiked.has(photoId)) {
        newLiked.delete(photoId)
      } else {
        newLiked.add(photoId)
      }
      return newLiked
    })
  }

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    if (!selectedPhoto) return

    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedPhoto(photos[newIndex])
  }

  const clearAllPhotos = () => {
    localStorage.removeItem("wedding-photos")
    loadPhotos()
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
          <Skeleton className="h-8 w-64 mx-auto bg-white/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="bg-white/10 border-white/20">
              <CardContent className="p-0">
                <Skeleton className="w-full h-60 bg-white/20" />
              </CardContent>
              <CardFooter className="p-4">
                <Skeleton className="h-4 w-1/2 bg-white/20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Anılar Galerisi
          </h2>
          <p className="text-xl text-gray-300 mb-2">{photos.length} özel an paylaşıldı</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-gray-400">Her fotoğraf bir hikaye anlatıyor</span>
            <Heart className="w-5 h-5 text-pink-400" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={loadPhotos}
              variant="ghost"
              className="text-white hover:text-pink-400 hover:bg-pink-400/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Yenile
            </Button>
            <Button
              onClick={clearAllPhotos}
              variant="ghost"
              className="text-white hover:text-red-400 hover:bg-red-400/10"
            >
              Tümünü Temizle
            </Button>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Henüz Fotoğraf Yok</h3>
            <p className="text-gray-300 text-lg">İlk anıyı paylaşan siz olun! ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
              <Card
                key={photo.id}
                className="group bg-white/10 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white/20 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => openLightbox(photo)}
              >
                <CardContent className="p-0 relative aspect-square overflow-hidden">
                  <img
                    src={photo.path || "/placeholder.svg"}
                    alt={photo.fileName || "Düğün fotoğrafı"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(photo.id)
                        }}
                        className={`transition-all duration-300 ${
                          likedPhotos.has(photo.id)
                            ? "text-red-400 bg-red-400/20"
                            : "text-white hover:text-red-400 hover:bg-red-400/20"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedPhotos.has(photo.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-400" />
                      <p className="font-semibold text-white truncate" title={photo.uploaderName}>
                        {photo.uploaderName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <p className="text-gray-300 text-sm">
                        {new Date(photo.uploadedAt).toLocaleDateString("tr-TR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigatePhoto("prev")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigatePhoto("next")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Image */}
            <img
              src={selectedPhoto.path || "/placeholder.svg"}
              alt={selectedPhoto.fileName}
              className="w-full h-full object-contain rounded-lg"
            />

            {/* Photo info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{selectedPhoto.uploaderName}</p>
                  <p className="text-gray-300 text-sm">
                    {new Date(selectedPhoto.uploadedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(selectedPhoto.id)}
                    className={`transition-all duration-300 ${
                      likedPhotos.has(selectedPhoto.id)
                        ? "text-red-400 bg-red-400/20"
                        : "text-white hover:text-red-400 hover:bg-red-400/20"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPhotos.has(selectedPhoto.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = selectedPhoto.path
                      link.download = selectedPhoto.fileName
                      link.click()
                    }}
                    className="text-white hover:text-blue-400 hover:bg-blue-400/20"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
