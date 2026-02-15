"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera as CameraIcon, Download, X, RotateCcw } from "lucide-react";

interface CameraProps {
  onCapture: (blobUrl: string) => void;
}

function Camera({ onCapture }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [flash, setFlash] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setIsStreaming(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      onCapture(canvas.toDataURL("image/jpeg", 0.8));
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    setIsStreaming(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {!isStreaming ? (
        <button
          onClick={startCamera}
          className="flex flex-col items-center gap-3 group"
        >
          <div className="p-5 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-all">
            <CameraIcon size={32} className="text-emerald-500" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
            OpenCamera
          </span>
        </button>
      ) : (
        <div className="absolute inset-0 z-50 w-full rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300 bg-black shadow-2xl aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {flash && (
            <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200" />
          )}

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-10 items-center z-[60]">
            <button
              onClick={stopCamera}
              className="p-3 bg-white/10  hover:bg-red-500 backdrop-blur-md text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>

            <button
              onClick={takePhoto}
              className="p-1 border-4 border-white/20 rounded-full hover:border-emerald-500 transition-all"
            >
              <CameraIcon size={24} className="text-black" />
            </button>

            <div className="w-[50px]" />
          </div>

          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        </div>
      )}
    </div>
  );
}

export default Camera;
