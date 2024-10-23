'use client'

import { useState, ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function ProductFormComponent() {
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages].slice(0, 6))
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log({ images, title, description, price, category })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-lg">
      <div>
        <Label htmlFor="images" className="block text-lg font-semibold mb-2">Product Images (Max 6)</Label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={images.length >= 6}
          className="cursor-pointer"
        />
        {images.length >= 6 && (
          <p className="text-yellow-600 text-sm mt-2">Maximum number of images reached.</p>
        )}
      </div>

      <div>
        <Label htmlFor="title" className="block text-lg font-semibold mb-2">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          placeholder="Enter product title"
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-1">{title.length}/80 characters</p>
      </div>

      <div>
        <Label htmlFor="description" className="block text-lg font-semibold mb-2">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          className="w-full"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="price" className="block text-lg font-semibold mb-2">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          min="0"
          step="0.01"
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="category" className="block text-lg font-semibold mb-2">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="toys">Toys & Games</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">Submit Product</Button>
    </form>
  )
}