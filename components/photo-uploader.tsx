"use client"

import type React from "react"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UploadCloud, CheckCircle, AlertCircle, Camera, Heart, X, ImageIcon } from "lucide-react"

interface UploadedFile {
  file: File
  preview: string
  progress: number
  error?: string
  success?: boolean
  uploading?: boolean
}

interface PhotoUploaderProps {
  onPhotosUploaded?: (
    photos: Array<{ id: string; fileName: string; uploaderName: string; uploadedAt: string; path: string }>,
  ) => void
}

export default function PhotoUploader({ onPhotosUploaded }: PhotoUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [uploaderName, setUploaderName] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploading: false,
      }))
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    if (files.length > 0) {
      const filesArray = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploading: false,
      }))
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray])
    }
  }

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selectedFiles.length === 0) {
      alert("Lütfen yüklenecek bir fotoğraf seçin.")
      return
    }

    setIsUploading(true)
    setOverallProgress(0)

    const totalFiles = selectedFiles.filter((f) => !f.success && !f.uploading).length
    let completedFiles = 0

    // Simüle edilmiş yükleme işlemi
    const uploadPromises = selectedFiles.map(async (uploadedFile, index) => {
      if (uploadedFile.success || uploadedFile.uploading) return

      setSelectedFiles((prev) => prev.map((f, i) => (i === index ? { ...f, uploading: true, error: undefined } : f)))

      try {
        // Simüle edilmiş ilerleme
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setSelectedFiles((prev) => prev.map((f, i) => (i === index ? { ...f, progress } : f)))
        }

        setSelectedFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, success: true, uploading: false, progress: 100 } : f)),
        )

        completedFiles++
        setOverallProgress((completedFiles / totalFiles) * 100)

        // LocalStorage'a kaydet
        const photoData = {
          id: Date.now().toString() + index,
          fileName: uploadedFile.file.name,
          uploaderName: uploaderName || "Misafir",
          uploadedAt: new Date().toISOString(),
          path: uploadedFile.preview,
        }

        const existingPhotos = JSON.parse(localStorage.getItem("wedding-photos") || "[]")
        existingPhotos.push(photoData)
        localStorage.setItem("wedding-photos", JSON.stringify(existingPhotos))

        // Parent component'e bildir
        if (onPhotosUploaded) {
          onPhotosUploaded([photoData])
        }
      } catch (error) {
        console.error("Upload error:", error)
        setSelectedFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, error: "Yükleme başarısız oldu", uploading: false } : f)),
        )
      }
    })

    try {
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error("Bazı yüklemeler başarısız oldu:", error)
    } finally {
      setIsUploading(false)
      // Başarılı yüklemelerden sonra dosyaları temizle
      setTimeout(() => {
        setSelectedFiles([])
        setOverallProgress(0)
      }, 2000)
    }
  }

  const removeFile = (fileName: string) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((f) => f.file.name !== fileName))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="text-pink-400 w-8 h-8" />
            <Heart className="text-red-400 w-6 h-6 animate-pulse" />
            <ImageIcon className="text-blue-400 w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Anılarınızı Paylaşın
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Düğünümüzden çektiğiniz özel fotoğrafları yükleyin ve sevgimizin hikayesine katkıda bulunun ✨
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleUpload} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="uploaderName" className="text-white text-lg font-medium">
                Adınız
              </Label>
              <Input
                id="uploaderName"
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 text-lg py-3 focus:bg-white/20 transition-all duration-300"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white text-lg font-medium">Fotoğraflarınızı Seçin</Label>
              <div
                className={`relative transition-all duration-300 ${isDragOver ? "scale-105" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragOver ? "border-pink-400 bg-pink-400/10" : "border-white/30 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <UploadCloud
                        className={`w-16 h-16 transition-all duration-300 ${
                          isDragOver ? "text-pink-400 scale-110" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="fileUpload"
                        className="inline-block cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Fotoğraf Seç
                        <Input
                          id="fileUpload"
                          name="fileUpload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                          accept="image/*"
                          disabled={isUploading}
                        />
                      </label>
                      <p className="text-gray-300">veya dosyaları buraya sürükleyin</p>
                    </div>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF desteklenir (MAX. 10MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-pink-400" />
                  Seçilen Fotoğraflar ({selectedFiles.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedFiles.map((uploadedFile, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={uploadedFile.preview || "/placeholder.svg"}
                              alt={uploadedFile.file.name}
                              className="h-16 w-16 object-cover rounded-lg shadow-md"
                            />
                            {uploadedFile.success && (
                              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate" title={uploadedFile.file.name}>
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        {!uploadedFile.uploading && !uploadedFile.success && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadedFile.file.name)}
                            disabled={isUploading}
                            className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {uploadedFile.uploading && (
                        <div className="space-y-2">
                          <Progress value={uploadedFile.progress} className="h-2" />
                          <p className="text-sm text-gray-400">Yükleniyor... {Math.round(uploadedFile.progress)}%</p>
                        </div>
                      )}

                      {uploadedFile.error && (
                        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Yükleme Hatası</AlertTitle>
                          <AlertDescription>{uploadedFile.error}</AlertDescription>
                        </Alert>
                      )}

                      {uploadedFile.success && (
                        <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <AlertTitle>Başarılı!</AlertTitle>
                          <AlertDescription>Fotoğraf başarıyla yüklendi.</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isUploading && overallProgress > 0 && (
              <div className="space-y-3">
                <Label className="text-white text-lg">Genel Yükleme İlerlemesi</Label>
                <Progress value={overallProgress} className="h-3" />
                <p className="text-center text-gray-300">{Math.round(overallProgress)}% tamamlandı</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isUploading || selectedFiles.length === 0 || selectedFiles.every((f) => f.success)}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Yükleniyor...
                </div>
              ) : (
                `${selectedFiles.filter((f) => !f.success && !f.uploading).length} Fotoğrafı Yükle ✨`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
