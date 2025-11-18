"use client"

import { useState } from "react"
import { TranscriptFetcher } from "@/components/transcript-fetcher"
import { TranscriptList } from "@/components/transcript-list"
import { Youtube } from "lucide-react"

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTranscriptFetched = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/15 rounded-2xl border border-primary/20">
              <Youtube className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground tracking-tight">
            YouTube Transcripts
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fetch and manage video transcripts with fast, reliable caching
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Fetch Column */}
          <div className="lg:col-span-1">
            <TranscriptFetcher onTranscriptFetched={handleTranscriptFetched} />
          </div>

          {/* Library Column */}
          <div className="lg:col-span-2">
            <TranscriptList key={refreshKey} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8">
          <p>
            Powered by{" "}
            <a
              href="https://youtube-transcript-storage.automatehub.workers.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary transition-colors"
            >
              Cloudflare Workers
            </a>
            {" "}and{" "}
            <a
              href="https://fetch.youtubesummaries.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:text-primary transition-colors"
            >
              YouTube API
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
