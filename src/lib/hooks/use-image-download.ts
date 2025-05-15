"use client"

import { useState } from "react"
import { toPng } from "html-to-image"

interface UseImageDownloadOptions {
  fileName?: string
  quality?: number
  pixelRatio?: number
}

export function useImageDownload(options: UseImageDownloadOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false)

  const { fileName = "image.png", quality = 0.95, pixelRatio = 2 } = options

  const downloadImage = async (element: HTMLElement | null) => {
    if (!element) return

    try {
      setIsGenerating(true)

      // Generate the image
      const dataUrl = await toPng(element, {
        quality,
        pixelRatio,
        cacheBust: true,
      })

      // Create a download link
      const link = document.createElement("a")
      link.download = fileName
      link.href = dataUrl
      link.click()

      return dataUrl
    } catch (error) {
      console.error("Error generating image:", error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    downloadImage,
    isGenerating,
  }
}
