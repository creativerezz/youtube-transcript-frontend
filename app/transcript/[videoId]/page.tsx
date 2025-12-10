"use client"

import { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { api, type VideoTranscript } from "@/lib/api"
import { ArrowLeft, Download, Loader2, ExternalLink, Copy, Check, Search, X, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function TranscriptPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.videoId as string
  const [transcript, setTranscript] = useState<VideoTranscript | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchIndex, setSearchIndex] = useState(0)
  const [searchMatches, setSearchMatches] = useState<number[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadTranscript = async () => {
      setLoading(true)
      try {
        const data = await api.getTranscript(videoId)
        setTranscript(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load transcript",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    loadTranscript()
  }, [videoId])

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
      description: "Transcript downloaded successfully",
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  // Parse captions into paragraphs for better readability
  const parseCaptions = (captions: string, highlightQuery?: string): Array<{ text: string; index: number }> => {
    // Split by double newlines first (natural paragraphs)
    const naturalParagraphs = captions.split(/\n\n+/)

    let paragraphs: string[]
    // If we have natural paragraphs, use them
    if (naturalParagraphs.length > 1) {
      paragraphs = naturalParagraphs.filter(p => p.trim().length > 0)
    } else {
      // Otherwise, split into chunks of ~3-5 sentences for readability
      const sentences = captions.split(/([.!?]+\s+)/)
      paragraphs = []
      let currentParagraph = ''
      let sentenceCount = 0

      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i] + (sentences[i + 1] || '')
        currentParagraph += sentence
        sentenceCount++

        // Create a new paragraph after 3-5 sentences
        if (sentenceCount >= 4 || i >= sentences.length - 2) {
          if (currentParagraph.trim()) {
            paragraphs.push(currentParagraph.trim())
          }
          currentParagraph = ''
          sentenceCount = 0
        }
      }
    }

    return paragraphs.length > 0 
      ? paragraphs.map((p, i) => ({ text: p, index: i }))
      : [{ text: captions, index: 0 }]
  }

  // Highlight search query in text
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary-foreground px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  // Parse timestamp entries for better display
  interface TimestampEntry {
    time: string
    text: string
    seconds: number
    index: number
  }

  const parseTimestamps = (timestamps: string[]): TimestampEntry[] => {
    return timestamps.map((ts, index) => {
      // Match format like "[00:00:15] text" or "00:00:15 text"
      const match = ts.match(/\[?(\d{2}:\d{2}:\d{2})\]?\s*(.*)/)
      if (match) {
        const [, time, text] = match
        const [hours, minutes, seconds] = time.split(':').map(Number)
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        return { time, text, seconds: totalSeconds, index }
      }
      return { time: '00:00:00', text: ts, seconds: 0, index }
    })
  }

  // Filter and highlight search results
  const filteredTimestamps = useMemo(() => {
    if (!transcript) return []
    const parsed = parseTimestamps(transcript.timestamps)
    
    if (!searchQuery.trim()) return parsed
    
    const query = searchQuery.toLowerCase()
    const filtered = parsed.filter(entry => 
      entry.text.toLowerCase().includes(query)
    )
    
    // Update search matches for navigation
    setSearchMatches(filtered.map(e => e.index))
    
    return filtered
  }, [transcript, searchQuery])

  const filteredCaptions = useMemo(() => {
    if (!transcript) return []
    const parsed = parseCaptions(transcript.captions)
    
    if (!searchQuery.trim()) return parsed
    
    const query = searchQuery.toLowerCase()
    return parsed.filter(paragraph => 
      paragraph.text.toLowerCase().includes(query)
    )
  }, [transcript, searchQuery])

  // Navigate to next/previous search result
  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchMatches.length === 0) return
    
    if (direction === 'next') {
      setSearchIndex((prev) => (prev + 1) % searchMatches.length)
    } else {
      setSearchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length)
    }
  }

  // Scroll to search result
  useEffect(() => {
    if (searchQuery && searchMatches.length > 0 && transcript) {
      const matchIndex = searchMatches[searchIndex]
      const element = document.getElementById(`timestamp-${matchIndex}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2')
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2')
        }, 2000)
      }
    }
  }, [searchIndex, searchMatches, searchQuery, transcript])

  const jumpToTimestamp = (seconds: number) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${transcript?.video_id}&t=${seconds}s`
    window.open(youtubeUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!transcript) {
    return null
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${transcript.video_id}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-primary hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Video Info Card */}
        <Card className="mb-6 border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex flex-col md:flex-row gap-4">
              {transcript.thumbnail_url && (
                <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                  <Image
                    src={transcript.thumbnail_url}
                    alt={transcript.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 256px"
                  />
                </div>
              )}
              {!transcript.thumbnail_url && (
                <div className="w-full md:w-64 aspect-video bg-muted rounded-lg border border-border/40 flex items-center justify-center shrink-0">
                  <div className="text-sm text-muted-foreground">No thumbnail available</div>
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2 text-foreground">{transcript.title}</CardTitle>
                <CardDescription className="space-y-1">
                  <span className="block text-base text-muted-foreground font-medium">{transcript.author_name}</span>
                  <span className="block text-sm text-muted-foreground">Video ID: {transcript.video_id}</span>
                  <span className="block text-sm text-muted-foreground">
                    Created: {new Date(transcript.created_at).toLocaleString()}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    Updated: {new Date(transcript.updated_at).toLocaleString()}
                  </span>
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ExternalLink className="h-4 w-4" />
                      Watch on YouTube
                    </Button>
                  </a>
                  <Button variant="outline" size="sm" onClick={downloadTranscript} className="border-border/60 hover:bg-accent/50">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Transcript Content */}
        <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
            <CardTitle className="text-foreground">Transcript</CardTitle>
            <CardDescription>
              Full transcript with captions and timestamps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="captions">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/40 border border-border/40">
                <TabsTrigger value="captions">Captions</TabsTrigger>
                <TabsTrigger value="timestamps">Timestamps</TabsTrigger>
              </TabsList>

              <TabsContent value="captions" className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search in captions..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setSearchIndex(0)
                    }}
                    className="pl-9 pr-9 text-sm border-border/80 focus:border-primary/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("")
                        setSearchIndex(0)
                        setSearchMatches([])
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcript.captions)}
                    className="border-border/60 hover:bg-primary/10 text-primary"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted/30 p-6 rounded-lg border border-border/40 text-foreground/80 max-h-[600px] overflow-y-auto">
                  <div className="space-y-4 text-base leading-relaxed">
                    {filteredCaptions.map((paragraph, index) => (
                      <p key={index} className="text-foreground/90">
                        {searchQuery ? highlightText(paragraph.text, searchQuery) : paragraph.text}
                      </p>
                    ))}
                    {searchQuery && filteredCaptions.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No matches found
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timestamps" className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search in timestamps..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setSearchIndex(0)
                      }}
                      className="pl-9 pr-9 text-sm border-border/80 focus:border-primary/50"
                    />
                    {searchQuery && (
                      <>
                        <button
                          onClick={() => {
                            setSearchQuery("")
                            setSearchIndex(0)
                            setSearchMatches([])
                          }}
                          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {searchMatches.length > 0 && (
                          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                            <button
                              onClick={() => navigateSearch('prev')}
                              className="p-1 hover:bg-primary/10 rounded"
                              title="Previous match"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <span className="px-1">
                              {searchIndex + 1}/{searchMatches.length}
                            </span>
                            <button
                              onClick={() => navigateSearch('next')}
                              className="p-1 hover:bg-primary/10 rounded"
                              title="Next match"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(transcript.timestamps.join('\n'))}
                    className="border-border/60 hover:bg-primary/10 text-primary"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-muted/30 p-6 rounded-lg border border-border/40 space-y-1 max-h-[600px] overflow-y-auto">
                  {(searchQuery ? filteredTimestamps : parseTimestamps(transcript.timestamps)).map((entry) => (
                    <div
                      key={entry.index}
                      id={`timestamp-${entry.index}`}
                      onClick={() => jumpToTimestamp(entry.seconds)}
                      className="flex items-start gap-3 py-2 px-3 hover:bg-primary/10 rounded cursor-pointer transition-colors group"
                    >
                      <span className="text-xs font-mono text-primary font-semibold min-w-[65px] mt-0.5 group-hover:text-primary/80">
                        {entry.time}
                      </span>
                      <span className="text-sm text-foreground/90 leading-relaxed flex-1">
                        {searchQuery ? highlightText(entry.text, searchQuery) : entry.text}
                      </span>
                    </div>
                  ))}
                  {searchQuery && filteredTimestamps.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No matches found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
