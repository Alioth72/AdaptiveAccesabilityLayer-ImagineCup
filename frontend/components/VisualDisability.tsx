"use client";
import { useEffect, useRef } from "react";
import React, { useState } from "react";

export default function VisualDisability() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🔊 NEW (already present, just used now)
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setAudioUrl(null); // reset audio on new upload

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "http://127.0.0.1:8000/visual-disability/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Backend response:", data);

      setResult(data);
    } catch (err) {
      setError("Failed to process document");
    } finally {
      setLoading(false);
    }
  };

  // 🔊 NEW: call backend TTS
    const handleReadAloud = async () => {
      if (!result) return;

      setIsSpeaking(true);

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/visual-disability/tts",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pages: result.pages }),
          }
        );

        const data = await res.json();

        // backend returns relative path like out/visual/audio/xyz.wav
        setAudioUrl(`http://127.0.0.1:8000/${data.audio_path}`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSpeaking(false);
      }
    };

    const handleStopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0; // reset to start
  };

             


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Visual Disability Support</h1>

      {/* Upload */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? "Processing..." : "Upload & Analyze"}
        </button>

        {/* 🔊 NEW BUTTON */}
        {result && (
          <div className="flex gap-2">
            <button
              onClick={handleReadAloud}
              disabled={isSpeaking}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              {isSpeaking ? "Generating Audio..." : "🔊 Read Aloud"}
            </button>

            <button
              onClick={handleStopAudio}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              ⏹ Stop
            </button>
          </div>
        )}

      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Output */}
      {result && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            File: {result.filename} | Time: {result.processing_time}s
          </p>

          {Array.isArray(result.pages) &&
            result.pages.map((page: any, pageIdx: number) => (
              <div
                key={pageIdx}
                className="border rounded-lg p-4 bg-white shadow"
              >
                <h2 className="font-semibold mb-3">
                  Page {page.page}
                </h2>

                <div className="space-y-2">
                  {page.content.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm">
                      <strong>{item.tag}:</strong>{" "}
                      {item.content}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* 🔊 AUDIO PLAYER */}
          {audioUrl && (
            <audio
              ref={audioRef}     // ✅ THIS LINE FIXES STOP
              src={audioUrl}
              autoPlay
              controls
              className="w-full"
            />
          )}



        </div>
      )}
    </div>
  );
}
