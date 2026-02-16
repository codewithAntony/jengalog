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
  // const [flash, setFlash] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  // const [stream, setStream] = useState<MediaStream | null>(null);

  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  // const killCamera = () => {
  //   if (videoRef.current && videoRef.current.srcObject) {
  //     const stream = videoRef.current.srcObject as MediaStream;
  //     const tracks = stream.getTracks();

  //     tracks.forEach((track) => {
  //       track.stop();
  //     });

  //     videoRef.current.srcObject = null;
  //   }
  //   setIsStreaming(false);
  // };

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

      // Using a timeout ensures the <video> element exists in the DOM
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Log to verify it's working
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
  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
  //     });
  //     setIsStreaming(true);

  //     setTimeout(() => {
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //         videoRef.current.play();
  //       }
  //     }, 100);
  //   } catch (err) {
  //     console.error("Camera error:", err);
  //   }
  // };

  // const takePhoto = () => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   const canvas = document.createElement("canvas");
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //   if (mode === "SCAN") {
  //     ctx.filter = "contrast(1.5) grayscale(1)";
  //     ctx.drawImage(canvas, 0, 0);

  //     const imageData = canvas.toDataURL("image/jpeg", 1.0);

  //     const pdf = new jsPDF({
  //       orientation: canvas.width > canvas.height ? "l" : "p",
  //       unit: "px",
  //       format: [canvas.width, canvas.height],
  //     });
  //     pdf.addImage(imageData, "JPEG", 0, 0, canvas.width, canvas.height);
  //     pdf.save(`note-scan-${Date.now()}.pdf`);

  //     onCapture(imageData);
  //   } else {
  //     onCapture(canvas.toDataURL("image/jpeg", 0.9));
  //   }

  //   killCamera();
  // };

  // useEffect(() => {
  //   return () => killCamera();
  // }, []);

  //   const stopCamera = () => {
  //     if (videoRef.current?.srcObject) {
  //       const stream = videoRef.current.srcObject as MediaStream;
  //       stream.getTracks().forEach((track) => track.stop());
  //     }

  //     setIsStreaming(false);
  //   };

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

  // const generateCroppedImage = async () => {
  //   if (!completedCrop || !imgRef.current) return;

  //   const image = imgRef.current;
  //   const canvas = document.createElement("canvas");
  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;

  //   canvas.width = completedCrop.width;
  //   canvas.height = completedCrop.height;
  //   const ctx = canvas.getContext("2d");

  //   if (ctx) {
  //     // Apply Scan Filters during the crop
  //     ctx.filter = mode === "SCAN" ? "contrast(1.4) grayscale(1)" : "none";

  //     ctx.drawImage(
  //       image,
  //       completedCrop.x * scaleX,
  //       completedCrop.y * scaleY,
  //       completedCrop.width * scaleX,
  //       completedCrop.height * scaleY,
  //       0,
  //       0,
  //       completedCrop.width,
  //       completedCrop.height,
  //     );

  //     const finalData = canvas.toDataURL("image/jpeg", 1.0);

  //     // Generate PDF
  //     const pdf = new jsPDF({
  //       orientation: canvas.width > canvas.height ? "l" : "p",
  //       unit: "px",
  //       format: [canvas.width, canvas.height],
  //     });
  //     pdf.addImage(finalData, "JPEG", 0, 0, canvas.width, canvas.height);
  //     pdf.save(`scan-${Date.now()}.pdf`);

  //     onCapture(finalData);
  //     setTempImage(null);
  //   }
  // };

  // const generateCroppedImage = async () => {
  //   // 1. Get references
  //   const image = imgRef.current;
  //   if (!image || !tempImage) return;

  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   // 2. Define the crop area (Fallback to full image if no crop was made)
  //   const cropArea = completedCrop || {
  //     unit: "px",
  //     x: 0,
  //     y: 0,
  //     width: image.width,
  //     height: image.height,
  //   };

  //   // 3. Calculate scaling (Natural image size vs Display size)
  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;

  //   // 4. Set canvas dimensions to the cropped size (multiplied by natural scale for high quality)
  //   canvas.width = cropArea.width * scaleX;
  //   canvas.height = cropArea.height * scaleY;

  //   // 5. Draw the cropped section
  //   ctx.filter = mode === "SCAN" ? "contrast(1.4) grayscale(1)" : "none";

  //   ctx.drawImage(
  //     image,
  //     cropArea.x * scaleX,
  //     cropArea.y * scaleY,
  //     cropArea.width * scaleX,
  //     cropArea.height * scaleY,
  //     0,
  //     0,
  //     canvas.width,
  //     canvas.height,
  //   );

  //   // 6. Finalize Data
  //   const finalData = canvas.toDataURL("image/jpeg", 0.95);

  //   // 7. Safety check for jsPDF arguments
  //   const pdfWidth = Math.max(canvas.width, 1);
  //   const pdfHeight = Math.max(canvas.height, 1);

  //   try {
  //     const pdf = new jsPDF({
  //       orientation: pdfWidth > pdfHeight ? "l" : "p",
  //       unit: "px",
  //       format: [pdfWidth, pdfHeight],
  //       hotfixes: ["px_scaling"], // Fixes some coordinate issues in jsPDF
  //     });

  //     pdf.addImage(finalData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`scan-${Date.now()}.pdf`);

  //     onCapture(finalData);
  //     setTempImage(null);
  //     setCompletedCrop(undefined); // Reset for next time
  //   } catch (error) {
  //     console.error("PDF Generation failed:", error);
  //     // If PDF fails, still save the image to the project
  //     onCapture(finalData);
  //     setTempImage(null);
  //   }
  // };

  // const generateCroppedImage = async () => {
  //   const image = imgRef.current;
  //   if (!image || !tempImage) return;

  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   // Use completedCrop if exists, otherwise use full image
  //   const cropArea = completedCrop || {
  //     unit: "px",
  //     x: 0,
  //     y: 0,
  //     width: image.width,
  //     height: image.height,
  //   };

  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;

  //   canvas.width = cropArea.width * scaleX;
  //   canvas.height = cropArea.height * scaleY;

  //   if (mode === "SCAN") {
  //     ctx.filter = "contrast(1.4) grayscale(1) brightness(1.1)";
  //   }

  //   ctx.drawImage(
  //     image,
  //     cropArea.x * scaleX,
  //     cropArea.y * scaleY,
  //     cropArea.width * scaleX,
  //     cropArea.height * scaleY,
  //     0,
  //     0,
  //     canvas.width,
  //     canvas.height,
  //   );

  //   // Convert to high-quality JPEG
  //   const finalDataUrl = canvas.toDataURL("image/jpeg", 0.9);

  //   // SEND TO PAGE (Instead of downloading)
  //   onCapture(finalDataUrl);

  //   // Reset UI
  //   setTempImage(null);
  //   setCompletedCrop(undefined);
  //   setCrop(undefined);
  // };

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

    // Apply filter ONLY if in SCAN mode
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

    // Send the result to the dashboard
    onCapture(finalDataUrl);

    // RESET UI (Closing the crop screen)
    setTempImage(null);
    setCompletedCrop(undefined);
    setCrop(undefined);

    // NOTE: We removed the pdf.save() part so it doesn't download to your computer!
  };

  // Add this to ensure handles appear as soon as the image loads
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
    // <div className="w-full h-full flex items-center justify-center">
    //   {!isStreaming ? (
    //     <button
    //       onClick={startCamera}
    //       className="flex flex-col items-center gap-3 group"
    //     >
    //       <div className="p-5 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20">
    //         {mode === "SCAN" ? (
    //           <FileText size={40} className="text-emerald-500" />
    //         ) : (
    //           <CameraIcon size={40} className="text-emerald-500" />
    //         )}
    //       </div>

    //       <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">
    //         {mode === "SCAN" ? "Scan Notebook" : "Live Camera"}
    //       </span>
    //     </button>
    //   ) : (
    //     <div className="fixed inset-0 z-[100] rounded-2xl overflow-hidden animate-in fade-in zoom-in bg-black">
    //       <video
    //         ref={videoRef}
    //         autoPlay
    //         playsInline
    //         muted
    //         className="w-full h-full object-cover"
    //       />

    //       {/* {flash && (
    //         <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200" />
    //       )} */}

    //       <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-10 items-center">
    //         <button
    //           onClick={killCamera}
    //           className="p-3 bg-white/10 hover:bg-red-500 backdrop-blur-md text-white rounded-full transition-all"
    //         >
    //           <X size={24} />
    //         </button>

    //         <button
    //           onClick={takePhoto}
    //           className="p-1 border-4 border-white/20 rounded-full hover:border-emerald-500 transition-all"
    //         >
    //           <div className="bg-white p-5 rounded-full hover:bg-emerald-500">
    //             {mode === "SCAN" ? (
    //               <FileText size={30} className="text-black" />
    //             ) : (
    //               <CameraIcon size={30} className="text-black" />
    //             )}
    //           </div>
    //         </button>

    //         {/* <div className="w-[50px]" /> */}
    //       </div>

    //       {/* <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2">
    //         <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
    //         LIVE
    //       </div> */}
    //     </div>
    //   )}
    // </div>
    <div className="w-full h-full flex items-center justify-center">
      {/* ... Start Button Logic (same as before) ... */}
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

      {/* THE NEW CROPPER VIEW */}
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
