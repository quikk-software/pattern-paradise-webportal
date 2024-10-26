'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PaperclipIcon, SendIcon } from 'lucide-react'

type Message = {
  id: number
  user: string
  content: string
  timestamp: string
  file?: {
    name: string
    type: 'image' | 'document'
    url: string
  }
}

const userColors: { [key: string]: string } = {
  'Alice': 'bg-blue-100',
  'Bob': 'bg-green-100',
  'Charlie': 'bg-yellow-100',
  'You': 'bg-purple-100'
}

export function ChatScreenComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'Alice', content: 'Hey everyone!', timestamp: '10:00 AM' },
    { id: 2, user: 'Bob', content: 'Hi Alice!', timestamp: '10:01 AM' },
    { id: 3, user: 'Charlie', content: 'Hello there!', timestamp: '10:02 AM' },
    { id: 4, user: 'Alice', content: 'I have a document to share.', timestamp: '10:03 AM', file: { name: 'document.pdf', type: 'document', url: '#' } },
    { id: 5, user: 'You', content: 'Thanks for sharing!', timestamp: '10:04 AM' },
    { id: 6, user: 'Bob', content: 'Check out this image:', timestamp: '10:05 AM', file: { name: 'image.jpg', type: 'image', url: '/placeholder.svg?height=200&width=200' } },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSendMessage = () => {
    if (newMessage.trim() || file) {
      const newMsg: Message = {
        id: messages.length + 1,
        user: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      if (file) {
        newMsg.file = {
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          url: URL.createObjectURL(file)
        }
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
      setFile(null)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.user === 'You' ? 'ml-auto' : 'mr-auto'} max-w-[80%]`}>
              <div className={`flex items-start ${message.user === 'You' ? 'flex-row-reverse' : ''}`}>
                <Avatar className={`w-8 h-8 ${message.user === 'You' ? 'ml-2' : 'mr-2'}`}>
                  <AvatarImage src={`/placeholder.svg?text=${message.user.charAt(0)}`} />
                  <AvatarFallback>{message.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${userColors[message.user]} rounded-lg p-3`}>
                  <div className={`flex justify-between items-baseline ${message.user === 'You' ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold">{message.user}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className={`mt-1 ${message.user === 'You' ? 'text-right' : 'text-left'}`}>{message.content}</p>
                  {message.file && (
                    <div className={`mt-2 ${message.user === 'You' ? 'text-right' : 'text-left'}`}>
                      {message.file.type === 'image' ? (
                        <img src={message.file.url} alt={message.file.name} className="max-w-full h-auto rounded" />
                      ) : (
                        <a href={message.file.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                          📎 {message.file.name}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4 flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 mr-2"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <PaperclipIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <Button onClick={handleSendMessage} className="ml-2">
            <SendIcon className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
        {file && (
          <div className="mt-2 text-sm text-gray-500">
            File selected: {file.name}
          </div>
        )}
      </CardContent>
    </Card>
  )
}