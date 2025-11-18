"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
} from "@/components/ai-elements/artifact"
import { Loader } from "@/components/ai-elements/loader"
import { useToast } from "@/components/ui/use-toast"
import { api, type VideoTranscript } from "@/lib/api"
import { ChevronLeft, ChevronRight, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export function TranscriptList() {
  const [transcripts, setTranscripts] = useState<VideoTranscript[]>([])
  const [loading, setLoading] = useState(true)
  const [limit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const loadTranscripts = async () => {
    setLoading(true)
    try {
      const response = await api.listTranscripts(limit, offset)
      setTranscripts(response.transcripts)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load transcripts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTranscripts()
  }, [offset])

  const handleDelete = async (videoId: string) => {
    if (!confirm("Delete this transcript?")) {
      return
    }

    setDeleting(videoId)
    try {
      await api.deleteTranscript(videoId)
      toast({
        title: "Deleted",
        description: "Transcript removed",
      })
      loadTranscripts()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const handlePrevious = () => {
    if (offset >= limit) {
      setOffset(offset - limit)
    }
  }

  const handleNext = () => {
    if (transcripts.length === limit) {
      setOffset(offset + limit)
    }
  }

  return (
    <Artifact>
      <ArtifactHeader className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent">
        <div>
          <ArtifactTitle className="text-accent-foreground">Stored Transcripts</ArtifactTitle>
          <ArtifactDescription>Your cached videos</ArtifactDescription>
        </div>
      </ArtifactHeader>
      <ArtifactContent className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-primary">
            <Loader size={20} />
          </div>
        ) : transcripts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No transcripts yet</p>
            <p className="text-xs mt-1">Fetch a video to get started</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {transcripts.map((transcript) => {
                // Construct YouTube thumbnail URL from video ID
                const thumbnailUrl = transcript.thumbnail_url || `https://i.ytimg.com/vi/${transcript.video_id}/hqdefault.jpg`

                return (
                <div
                  key={transcript.id}
                  className="flex items-center gap-2 p-2 rounded-md border border-border/50 hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                >
                  <div className="relative w-20 h-12 rounded overflow-hidden bg-black shrink-0">
                    <Image
                      src={thumbnailUrl}
                      alt={transcript.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs leading-tight line-clamp-1 text-foreground">
                      {transcript.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {transcript.author_name}
                    </p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Link href={`/transcript/${transcript.video_id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-destructive/10"
                      onClick={() => handleDelete(transcript.video_id)}
                      disabled={deleting === transcript.video_id}
                    >
                      {deleting === transcript.video_id ? (
                        <Loader size={12} className="text-destructive" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
                )
              })}
            </div>

            {(offset > 0 || transcripts.length === limit) && (
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={offset === 0}
                  className="h-7 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {offset + 1}–{offset + transcripts.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={transcripts.length < limit}
                  className="h-7 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </>
        )}
      </ArtifactContent>
    </Artifact>
  )
}
