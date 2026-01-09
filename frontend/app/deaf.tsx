"use client"; // Required for client-side interactivity in App Router

import { useState, useEffect, useRef, useCallback } from "react";
import YouTube from "react-youtube";
import axios from "axios";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [highlightedPhrase, setHighlightedPhrase] = useState("");
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(-1);
  const [error, setError] = useState("");
  const playerRef = useRef<any>(null);
  const displayedEventsRef = useRef<Set<number>>(new Set());
  const paragraphStartTimesRef = useRef<Map<number, number>>(new Map());

  // Ensure component only renders client-side content after mount
  // This prevents hydration mismatches with client-only components like YouTube
  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate when each paragraph starts based on event timing
  const calculateParagraphStartTimes = (events: any[], paragraphs: string[]) => {
    paragraphStartTimesRef.current.clear();
    
    // Build a map of text to timing from events
    const textToTime = new Map<string, number>();
    events.forEach((event) => {
      if (event.segs) {
        const text = event.segs.map((seg: any) => seg.utf8 || "").join("").trim();
        if (text) {
          const startTime = (event.tStartMs || 0) / 1000.0;
          textToTime.set(text, startTime);
        }
      }
    });
    
    // Find the first occurrence of each paragraph's first words to determine start time
    paragraphs.forEach((para, paraIndex) => {
      const firstWords = para.split(/\s+/).slice(0, 5).join(" ").toLowerCase();
      
      // Find the earliest event that contains these words
      let earliestTime = Infinity;
      events.forEach((event) => {
        if (event.segs) {
          const eventText = event.segs.map((seg: any) => seg.utf8 || "").join("").toLowerCase();
          if (eventText.includes(firstWords) || firstWords.includes(eventText)) {
            const startTime = (event.tStartMs || 0) / 1000.0;
            if (startTime < earliestTime) {
              earliestTime = startTime;
            }
          }
        }
      });
      
      if (earliestTime !== Infinity) {
        paragraphStartTimesRef.current.set(paraIndex, earliestTime);
      }
    });
  };

  const getVideoId = (url: string): string => {
    if (!url) return "";
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return "";
  };

  const fetchCaptions = async () => {
    if (!url) return;
    
    const extractedVideoId = getVideoId(url);
    if (!extractedVideoId) {
      setError("Invalid YouTube URL");
      return;
    }
    
    setVideoId(extractedVideoId);
    setError("");
    setEvents([]);
    setParagraphs([]);
    setCurrentCaption("");
    setHighlightedPhrase("");
    setVisibleParagraphs([]);
    setCurrentParagraphIndex(-1);
    displayedEventsRef.current.clear();
    paragraphStartTimesRef.current.clear();

    try {
      const res = await axios.get(`http://localhost:8000/captions?url=${encodeURIComponent(url)}`);
      
      if (res.data.error) {
        setError(res.data.error);
        setEvents([]);
        setParagraphs([]);
        return;
      }
      
      const captionEvents = res.data.events || [];
      const captionParagraphs = res.data.paragraphs || [];
      
      if (captionEvents.length === 0) {
        setError("No captions available for this video");
        return;
      }
      
      setEvents(captionEvents);
      setParagraphs(captionParagraphs);
      setVisibleParagraphs([]);
      setCurrentParagraphIndex(-1);
      setHighlightedPhrase("");
      setError("");
      
      // Calculate when each paragraph starts based on events
      calculateParagraphStartTimes(captionEvents, captionParagraphs);
    } catch (err: any) {
      console.error("Error fetching captions:", err);
      
      // Handle different error types
      let errorMsg = "Failed to fetch captions. ";
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 404) {
          errorMsg = err.response.data?.error || "No captions available for this video";
        } else if (err.response.status === 500) {
          errorMsg = err.response.data?.error || "Server error while fetching captions";
        } else {
          errorMsg = err.response.data?.error || `Error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMsg = "Backend server is not responding. Make sure it's running on http://localhost:8000";
      } else {
        // Something else happened
        errorMsg = err.message || "Failed to fetch captions";
      }
      
      setError(errorMsg);
      setEvents([]);
      setParagraphs([]);
    }
  };

  // Find the current caption in paragraphs and highlight 3-4 words
  const findAndHighlightPhrase = useCallback((captionText: string, paragraphs: string[]) => {
    const captionLower = captionText.toLowerCase().trim();
    
    // Find which paragraph contains this caption
    for (let paraIndex = 0; paraIndex < paragraphs.length; paraIndex++) {
      const para = paragraphs[paraIndex];
      const paraLower = para.toLowerCase();
      
      // Check if this paragraph contains the caption text
      if (paraLower.includes(captionLower) || captionLower.includes(paraLower.split(/\s+/).slice(0, 5).join(" "))) {
        setCurrentParagraphIndex(paraIndex);
        
        // Extract 3-4 words around the caption text
        const words = para.split(/\s+/);
        const captionWords = captionText.split(/\s+/).filter(w => w.length > 0);
        
        // Find the position of caption words in the paragraph
        let startIdx = -1;
        for (let i = 0; i <= words.length - captionWords.length; i++) {
          const slice = words.slice(i, i + captionWords.length).join(" ").toLowerCase();
          if (slice.includes(captionLower) || captionLower.includes(slice)) {
            startIdx = i;
            break;
          }
        }
        
        if (startIdx !== -1) {
          // Get 3-4 words (expand a bit around the caption)
          const phraseStart = Math.max(0, startIdx - 1);
          const phraseEnd = Math.min(words.length, startIdx + captionWords.length + 2);
          const phrase = words.slice(phraseStart, phraseEnd).join(" ");
          setHighlightedPhrase(phrase);
        } else {
          // Fallback: use the caption text itself
          setHighlightedPhrase(captionText);
        }
        break;
      }
    }
  }, []);

  // Sync captions with YouTube player time and highlight phrases
  useEffect(() => {
    if (!events.length || !paragraphs.length || !playerRef.current) return;

    const updateCaptions = () => {
      if (!playerRef.current) return;
      
      try {
        // getCurrentTime() is synchronous and returns seconds as a number
        const currentTime = playerRef.current.getCurrentTime();
        if (typeof currentTime !== 'number' || isNaN(currentTime)) return;
        
        const currentTimeMs = currentTime * 1000;
        
        // Show paragraphs that have started
        const newVisibleParagraphs: number[] = [];
        paragraphStartTimesRef.current.forEach((startTime, paraIndex) => {
          if (currentTime >= startTime - 0.5) { // Show 0.5s before it starts
            newVisibleParagraphs.push(paraIndex);
          }
        });
        setVisibleParagraphs([...new Set(newVisibleParagraphs)].sort((a, b) => a - b));
        
        // Find all events that should be displayed at this time
        const activeEvents = events.filter((event) => {
          if (!event.segs) return false;
          
          const eventStart = event.tStartMs || 0;
          const eventDuration = event.dDurationMs || 0;
          const eventEnd = eventStart + eventDuration;
          
          return currentTimeMs >= eventStart && currentTimeMs < eventEnd;
        });

        // Get the most recent event that should be displayed
        if (activeEvents.length > 0) {
          const latestEvent = activeEvents[activeEvents.length - 1];
          const eventIndex = events.indexOf(latestEvent);
          
          const text = latestEvent.segs
            .map((seg: any) => seg.utf8 || "")
            .join("")
            .trim();
          
          if (text) {
            setCurrentCaption(text);
            
            // Find which paragraph contains this text and highlight the phrase
            findAndHighlightPhrase(text, paragraphs);
            displayedEventsRef.current.add(eventIndex);
          }
        }
      } catch (err: any) {
        console.error("Error getting current time:", err);
      }
    };

    const interval = setInterval(updateCaptions, 100);

    return () => clearInterval(interval);
  }, [events, paragraphs, findAndHighlightPhrase]);

  const handleReady = (event: { target: any }) => {
    playerRef.current = event.target;
  };

  const handleStateChange = (event: { data: number }) => {
    // Reset displayed events when video restarts
    if (event.data === 0) {
      displayedEventsRef.current.clear();
      setCurrentCaption("");
      setHighlightedPhrase("");
      setVisibleParagraphs([]);
      setCurrentParagraphIndex(-1);
    }
  };

  // Helper function to highlight text in a paragraph
  const highlightTextInParagraph = (paragraph: string, phraseToHighlight: string, paraIndex: number) => {
    if (!phraseToHighlight || paraIndex !== currentParagraphIndex) {
      return paragraph;
    }
    
    const paraLower = paragraph.toLowerCase();
    const phraseLower = phraseToHighlight.toLowerCase();
    
    // Find the phrase in the paragraph (case-insensitive)
    const index = paraLower.indexOf(phraseLower);
    if (index === -1) {
      // Try to find a close match
      const words = phraseToHighlight.split(/\s+/);
      if (words.length > 0) {
        const firstWord = words[0].toLowerCase();
        const firstWordIndex = paraLower.indexOf(firstWord);
        if (firstWordIndex !== -1) {
          // Find the end of the phrase (3-4 words)
          const paraWords = paragraph.split(/(\s+)/);
          let wordCount = 0;
          let startPos = 0;
          let endPos = paragraph.length;
          let foundStart = false;
          
          for (let i = 0; i < paraWords.length; i++) {
            if (paraWords[i].toLowerCase().includes(firstWord) && !foundStart) {
              startPos = paraWords.slice(0, i).join("").length;
              foundStart = true;
            }
            if (foundStart && paraWords[i].trim()) {
              wordCount++;
              if (wordCount >= 4) {
                endPos = paraWords.slice(0, i + 1).join("").length;
                break;
              }
            }
          }
          
          const before = paragraph.substring(0, startPos);
          const highlight = paragraph.substring(startPos, endPos);
          const after = paragraph.substring(endPos);
          
          return (
            <>
              {before}
              <span style={{ 
                backgroundColor: "#098a9c", 
                color: "white", 
                padding: "2px 4px",
                borderRadius: "3px",
                fontWeight: "600"
              }}>
                {highlight}
              </span>
              {after}
            </>
          );
        }
      }
      return paragraph;
    }
    
    const before = paragraph.substring(0, index);
    const highlight = paragraph.substring(index, index + phraseToHighlight.length);
    const after = paragraph.substring(index + phraseToHighlight.length);
    
    return (
      <>
        {before}
        <span style={{ 
          backgroundColor: "#098a9c", 
          color: "white", 
          padding: "2px 4px",
          borderRadius: "3px",
          fontWeight: "600"
        }}>
          {highlight}
        </span>
        {after}
      </>
    );
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px", minHeight: "100vh" }}>
      <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Paste YouTube link (e.g., https://www.youtube.com/watch?v=...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchCaptions();
              }
            }}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={fetchCaptions}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Load Video & Captions
          </button>
          {error && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#fee",
                color: "#c33",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {videoId && mounted && (
          <div style={{ width: "100%" }}>
            <YouTube
              videoId={videoId}
              opts={{
                width: "100%",
                height: "450",
                playerVars: {
                  autoplay: 0,
                  controls: 1,
                },
              }}
              onReady={handleReady}
              onStateChange={handleStateChange}
            />
          </div>
        )}
        {videoId && !mounted && (
          <div style={{ 
            width: "100%", 
            height: "450", 
            backgroundColor: "#f0f0f0", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            borderRadius: "4px"
          }}>
            <div style={{ color: "#666" }}>Loading video player...</div>
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#1a1a1a",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          minHeight: "500px",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "15px", fontSize: "18px" }}>
          Captions
        </h2>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            whiteSpace: "pre-line",
            fontSize: "14px",
            lineHeight: "1.8",
            padding: "10px",
            background: "#2a2a2a",
            borderRadius: "4px",
          }}
        >
          {paragraphs.length > 0 && currentParagraphIndex >= 0 ? (
            <div 
              style={{ 
                marginBottom: "12px",
                transition: "opacity 0.3s"
              }}
            >
              {highlightTextInParagraph(paragraphs[currentParagraphIndex], highlightedPhrase, currentParagraphIndex)}
            </div>
          ) : (
            <div style={{ color: "#888", fontStyle: "italic" }}>
              {error ? error : "Captions will appear here as the video plays..."}
            </div>
          )}
        </div>
        {currentCaption && (
          <div
            style={{
              marginTop: "15px",
              padding: "15px",
              background: "#333",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "500",
              border: "2px solid #007bff",
            }}
          >
            {currentCaption}
          </div>
        )}
      </div>
    </div>
  );
}
