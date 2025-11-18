"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
} from "@/components/ai-elements/artifact"
import { Loader } from "@/components/ai-elements/loader"
import { useToast } from "@/components/ui/use-toast"
import { api, extractVideoId, type VideoTranscript } from "@/lib/api"
import { Download, RefreshCw, Youtube } from "lucide-react"

interface TranscriptFetcherProps {
  onTranscriptFetched?: (transcript: VideoTranscript) => void
}

export function TranscriptFetcher({ onTranscriptFetched }: TranscriptFetcherProps) {
  const [videoUrl, setVideoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [transcript, setTranscript] = useState<VideoTranscript | null>(null)
  const { toast } = useToast()

  const handleFetch = async (force = false) => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL or video ID",
        variant: "destructive",
      })
      return
    }

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL or video ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await api.fetchTranscript({
        video: videoUrl,
        languages: ["en"],
        force,
      })

      setTranscript(response.data)
      onTranscriptFetched?.(response.data)

      toast({
        title: response.cached ? "Retrieved from cache" : "Transcript fetched",
        description: response.cached
          ? "Loaded instantly"
          : "Successfully stored",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch transcript",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadTranscript = () => {
    if (!transcript) return

    const content = `Title: ${transcript.title}
Author: ${transcript.author_name}
Video ID: ${transcript.video_id}
Created: ${new Date(transcript.created_at).toLocaleString()}

=== CAPTIONS ===
${transcript.captions}

=== TIMESTAMPS ===
${transcript.timestamps.join('\n')}
`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${transcript.video_id}-transcript.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Transcript saved to file",
    })
  }

  return (
    <Artifact>
      <ArtifactHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/20 rounded-lg border border-primary/30">
            <Youtube className="h-5 w-5 text-primary" />
          </div>
          <div>
            <ArtifactTitle className="text-primary">Fetch Transcript</ArtifactTitle>
            <ArtifactDescription>Enter a YouTube URL or ID</ArtifactDescription>
          </div>
        </div>
      </ArtifactHeader>
      <ArtifactContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-url" className="text-sm font-medium">YouTube URL or Video ID</Label>
          <div className="flex gap-2">
            <Input
              id="video-url"
              placeholder="https://youtu.be/... or video ID"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleFetch(false)
                }
              }}
              className="text-sm border-border/80 focus:border-primary/50"
            />
            <Button
              onClick={() => handleFetch(false)}
              disabled={loading}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader size={14} className="mr-2" />
                  Fetching
                </>
              ) : (
                "Fetch"
              )}
            </Button>
          </div>
        </div>

        {transcript && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex gap-3 p-2.5 rounded-lg bg-secondary/30 border border-secondary/40">
              {transcript.thumbnail_url && (
                <Image
                  src={transcript.thumbnail_url}
                  alt={transcript.title}
                  width={80}
                  height={48}
                  className="w-20 h-12 object-cover rounded flex-shrink-0"
                />
              )}
              {!transcript.thumbnail_url && (
                <div className="w-20 h-12 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                  <div className="text-xs text-muted-foreground">No image</div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
                  {transcript.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {transcript.author_name}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFetch(true)}
                disabled={loading}
                className="border-border/60 hover:bg-accent/50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refetch
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTranscript}
                className="border-border/60 hover:bg-accent/50"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          </div>
        )}
      </ArtifactContent>
    </Artifact>
  )
}
