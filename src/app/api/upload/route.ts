import { handleUpload } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json()

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Implement your own security measures here
        return { allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'] }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Here you can update your database with the blob URL if needed
        console.log('Upload completed:', blob)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

