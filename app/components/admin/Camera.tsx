"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera as CameraIcon,
  Download,
  X,
  RotateCcw,
  FileText,
  Check,
  Scissors,
} from "lucide-react";
import { jsPDF } from "jspdf";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface CameraProps {
  onCapture: (blobUrl: string) => void;
  mode?: "IMAGE" | "SCAN";
}

function Camera({ onCapture, mode = "IMAGE" }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const startCamera = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) {
      alert("Camera not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: mode === "SCAN" ? "environment" : "user",
        },
        audio: false,
      });

      setIsStreaming(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("Stream attached to video element");
        }
      }, 150);
    } catch (err) {
      console.error("Detailed Camera Error:", err);
      alert("Could not access camera. Please check browser permissions.");
    }
  };

  const killCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Track stopped:", track.label);
      });
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => killCamera();
  }, [killCamera]);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    if (mode === "SCAN") {
      setTempImage(dataUrl);
      killCamera();
    } else {
      onCapture(dataUrl);
      killCamera();
    }
  };

  const generateCroppedImage = async () => {
    const image = imgRef.current;
    if (!image || !tempImage || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    if (mode === "SCAN") {
      ctx.filter = "contrast(1.4) brightness(1.1) grayscale(1)";
    } else {
      ctx.filter = "none";
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const finalDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    onCapture(finalDataUrl);

    setTempImage(null);
    setCompletedCrop(undefined);
    setCrop(undefined);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const initialCrop: Crop = {
      unit: "%",
      x: 5,
      y: 5,
      width: 90,
      height: 90,
    };
    setCrop(initialCrop);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {!isStreaming && !tempImage && (
        <button
          onClick={startCamera}
          className="flex flex-col items-center gap-3 group px-8 py-10"
        >
          <div className="p-5 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-all">
            {mode === "SCAN" ? (
              <FileText size={40} className="text-emerald-500" />
            ) : (
              <CameraIcon size={40} className="text-emerald-500" />
            )}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
            {mode === "SCAN" ? "Scan Notebook" : "Live Camera"}
          </span>
        </button>
      )}

      {isStreaming && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-4xl max-h-[70vh] rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl"
          />
          <div className="mt-8 flex gap-10">
            <button
              onClick={killCamera}
              className="p-4 bg-white/10 rounded-full text-white"
            >
              <X size={24} />
            </button>
            <button
              onClick={takePhoto}
              className="p-6 bg-emerald-500 rounded-full text-black shadow-lg"
            >
              <CameraIcon size={32} />
            </button>
          </div>
        </div>
      )}

      {tempImage && (
        <div className="fixed inset-0 z-[101] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 max-w-4xl w-full flex flex-col items-center">
            <h3 className="text-emerald-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Scissors size={18} /> Adjust Scan Area
            </h3>

            <div className="max-h-[60vh] overflow-hidden rounded-lg bg-black">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={tempImage}
                  alt="Crop me"
                  className="max-h-[60vh] object-contain"
                />
              </ReactCrop>
            </div>

            <div className="mt-8 flex gap-4 w-full">
              <button
                onClick={() => setTempImage(null)}
                className="flex-1 py-4 bg-gray-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
              >
                Retake
              </button>
              <button
                onClick={generateCroppedImage}
                className="flex-1 py-4 bg-emerald-500 text-black rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <Check size={18} /> Finalize Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Camera;
