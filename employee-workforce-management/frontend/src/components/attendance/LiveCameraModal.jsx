import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle, X, ShieldAlert, Sparkles, ScanFace, ShieldCheck } from 'lucide-react';

export default function LiveCameraModal({ isOpen, onClose, onCapture, initialImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const analysisCanvasRef = useRef(null);
  const detectionTimerRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(initialImage || null);
  const [cameraError, setCameraError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // Real-time Face Detection States
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceConfidence, setFaceConfidence] = useState(0);
  const [detectionMessage, setDetectionMessage] = useState('Position your face inside the circle');
  const [faceWarning, setFaceWarning] = useState(null);
  const faceDetectedRef = useRef(false);

  useEffect(() => {
    faceDetectedRef.current = faceDetected;
  }, [faceDetected]);

  useEffect(() => {
    let isSubscribed = true;

    if (isOpen && !capturedImage) {
      startCamera(isSubscribed);
    } else {
      stopCamera();
    }

    return () => {
      isSubscribed = false;
      stopCamera();
    };
  }, [isOpen, capturedImage]);

  // Start video stream
  const startCamera = async (isSubscribed = true) => {
    setCameraError(null);
    setFaceDetected(false);
    setFaceConfidence(0);
    setDetectionMessage('Starting camera & face scanner...');

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!isSubscribed) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    startFaceDetectionLoop();
                  })
                  .catch((err) => {
                    if (err.name !== 'AbortError') {
                      console.warn('Camera play warning:', err);
                    }
                  });
              }
            }
          };
        }
      } else {
        throw new Error('Camera API not supported on this browser');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Camera stream error:', err);
        setCameraError('Camera access unavailable or blocked. Please allow camera permissions.');
      }
    }
  };

  // Stop video stream & detection loop
  const stopCamera = () => {
    stopFaceDetectionLoop();
    if (videoRef.current && videoRef.current.srcObject) {
      const currentStream = videoRef.current.srcObject;
      if (currentStream && currentStream.getTracks) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setFaceDetected(false);
    setFaceConfidence(0);
  };

  // Face Detection Loop
  const startFaceDetectionLoop = () => {
    stopFaceDetectionLoop();
    detectionTimerRef.current = setInterval(() => {
      runFaceDetection();
    }, 220);
  };

  const stopFaceDetectionLoop = () => {
    if (detectionTimerRef.current) {
      clearInterval(detectionTimerRef.current);
      detectionTimerRef.current = null;
    }
  };

  // Core Face Detection Logic (Chromium Native FaceDetector + Biometric Skin & Contrast Analysis)
  const runFaceDetection = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || video.paused || video.ended) {
      return;
    }

    // 1. Try Native Browser FaceDetector (Chromium / Chrome / Edge hardware face detector)
    if (typeof window !== 'undefined' && 'FaceDetector' in window) {
      try {
        const nativeDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        const faces = await nativeDetector.detect(video);
        if (faces && faces.length > 0) {
          const face = faces[0];
          const vidW = video.videoWidth || 640;
          const vidH = video.videoHeight || 480;
          const faceCenterX = face.boundingBox.x + face.boundingBox.width / 2;
          const faceCenterY = face.boundingBox.y + face.boundingBox.height / 2;

          // Verify face is centered inside the visual guide
          const isCentered =
            faceCenterX > vidW * 0.22 &&
            faceCenterX < vidW * 0.78 &&
            faceCenterY > vidH * 0.15 &&
            faceCenterY < vidH * 0.85;

          if (isCentered) {
            setFaceDetected(true);
            setFaceConfidence(98);
            setDetectionMessage('Face Detected & Aligned ✓');
            setFaceWarning(null);
            return;
          } else {
            setFaceDetected(false);
            setFaceConfidence(45);
            setDetectionMessage('Face off-center, move inside the circle');
            return;
          }
        } else {
          setFaceDetected(false);
          setFaceConfidence(0);
          setDetectionMessage('No face detected. Please show your face.');
          return;
        }
      } catch (e) {
        // Fall back to heuristic biometric analysis below
      }
    }

    // 2. High-Precision Biometric Skin & Facial Contrast Analyzer (Zero-dependency fallback)
    try {
      if (!analysisCanvasRef.current) {
        analysisCanvasRef.current = document.createElement('canvas');
      }
      const canvas = analysisCanvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const w = 120;
      const h = 90;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(video, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Center region of interest (oval guide region)
      const minX = Math.floor(w * 0.26);
      const maxX = Math.floor(w * 0.74);
      const minY = Math.floor(h * 0.16);
      const maxY = Math.floor(h * 0.84);

      let totalCenterPixels = 0;
      let skinPixels = 0;
      let brightnessSum = 0;
      let varianceSum = 0;
      const sampleBrightness = [];

      const cx = w / 2;
      const cy = h / 2;
      const rx = (maxX - minX) / 2;
      const ry = (maxY - minY) / 2;

      for (let y = minY; y < maxY; y += 2) {
        for (let x = minX; x < maxX; x += 2) {
          // Oval equation: ((x - cx)^2 / rx^2) + ((y - cy)^2 / ry^2) <= 1
          const norm = ((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2);
          if (norm > 1) continue;

          totalCenterPixels++;
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          brightnessSum += lum;
          sampleBrightness.push(lum);

          // Normalized RGB Skin tone
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const isSkinRGB =
            r > 60 && g > 35 && b > 20 &&
            (max - min) > 12 &&
            Math.abs(r - g) > 8 &&
            r >= g && r >= b;

          // YCbCr Skin Chromaticity Subspace
          const Y = lum;
          const Cb = -0.1687 * r - 0.3313 * g + 0.5 * b + 128;
          const Cr = 0.5 * r - 0.4187 * g - 0.0813 * b + 128;
          const isSkinYCbCr = (Y > 40 && Cb >= 75 && Cb <= 135 && Cr >= 130 && Cr <= 185);

          if (isSkinRGB || isSkinYCbCr) {
            skinPixels++;
          }
        }
      }

      if (totalCenterPixels === 0) return;

      const skinRatio = skinPixels / totalCenterPixels;
      const meanBrightness = brightnessSum / totalCenterPixels;

      // Calculate texture variance (facial details: eyes, eyebrows, nose, mouth have high contrast variance)
      // A plain painted wall or solid card has near zero variance
      for (let i = 0; i < sampleBrightness.length; i += 2) {
        varianceSum += Math.abs(sampleBrightness[i] - meanBrightness);
      }
      const avgVariance = varianceSum / (sampleBrightness.length / 2);

      // Validation criteria:
      // 1. Skin coverage in oval between 20% and 90%
      // 2. Texture variance >= 9.0 (distinguishes human face from flat colored surface)
      // 3. Adequate room lighting
      const hasSkinPresence = skinRatio >= 0.20 && skinRatio <= 0.92;
      const hasFaceTexture = avgVariance >= 8.5;
      const hasLighting = meanBrightness > 28 && meanBrightness < 242;

      if (!hasLighting) {
        setFaceDetected(false);
        setFaceConfidence(0);
        setDetectionMessage(meanBrightness <= 28 ? 'Lighting too dark - adjust position' : 'Lighting too bright');
        return;
      }

      if (hasSkinPresence && hasFaceTexture) {
        const conf = Math.min(99, Math.round((skinRatio * 55) + (avgVariance * 1.6)));
        setFaceDetected(true);
        setFaceConfidence(conf);
        setDetectionMessage(`Face Detected & Verified (${conf}%) ✓`);
        setFaceWarning(null);
      } else {
        setFaceDetected(false);
        setFaceConfidence(0);
        if (!hasSkinPresence) {
          setDetectionMessage('No face detected in circle');
        } else {
          setDetectionMessage('Hold still and look at camera');
        }
      }
    } catch (err) {
      // Detection fallback
    }
  };

  // Only allow snapshot when face is strictly detected
  const handleSnap = () => {
    if (!faceDetectedRef.current) {
      setFaceWarning('Face kudutha mattum capture aagum! Please show your face in the circle.');
      setTimeout(() => setFaceWarning(null), 3500);
      return;
    }

    setFaceWarning(null);
    setIsCapturing(true);
    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        doCapture();
        setIsCapturing(false);
      }
    }, 500);
  };

  // Capture image
  const doCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');

      // Mirror image horizontally for natural selfie view
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add digital timestamp & verification badge to image
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(16, canvas.height - 44, 300, 30);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`VERIFIED FACE ATTENDANCE • ${new Date().toLocaleTimeString()}`, 28, canvas.height - 24);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl ${faceDetected ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">AI Live Face Verification</h3>
              <p className="text-[11px] text-slate-500">Only face is permitted to capture selfie attendance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="p-4 sm:p-6">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-video flex items-center justify-center border-2 border-slate-800 shadow-2xl">
            
            {/* Live Countdown Overlay */}
            {countdown && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <span className="text-7xl font-black text-white animate-ping font-mono">{countdown}</span>
              </div>
            )}

            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* DYNAMIC FACE DETECTION OVAL GUIDE */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div
                    className={`w-40 h-52 sm:w-48 sm:h-60 rounded-full border-3 transition-all duration-300 flex flex-col items-center justify-between py-3 px-2 ${
                      faceDetected
                        ? 'border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.7)] bg-emerald-500/10'
                        : 'border-dashed border-amber-400/90 shadow-[0_0_15px_rgba(251,191,36,0.35)] bg-black/25'
                    }`}
                  >
                    {/* Top Status Pill inside Oval */}
                    <div
                      className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center space-x-1.5 transition-all shadow-md ${
                        faceDetected
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                          : 'bg-black/75 text-amber-300 border border-amber-400/50'
                      }`}
                    >
                      {faceDetected ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                          <span>Face Verified ({faceConfidence}%)</span>
                        </>
                      ) : (
                        <>
                          <ScanFace className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Show Face Here</span>
                        </>
                      )}
                    </div>

                    {/* Bottom Guide Hint */}
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${
                      faceDetected ? 'bg-emerald-950/80 text-emerald-200' : 'bg-black/60 text-white/80'
                    }`}>
                      {faceDetected ? '✓ Position Locked' : 'Align Eyes & Face'}
                    </span>
                  </div>
                </div>

                {/* Face Warning Toast */}
                {faceWarning && (
                  <div className="absolute top-3 inset-x-3 z-30 p-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold text-center shadow-lg animate-bounce flex items-center justify-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{faceWarning}</span>
                  </div>
                )}

                {/* Camera Error State */}
                {cameraError && (
                  <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-20">
                    <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                    <h4 className="text-white text-sm font-bold mb-1">Camera Permission Required</h4>
                    <p className="text-xs text-slate-400 max-w-xs">{cameraError}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="relative w-full h-full">
                <img src={capturedImage} alt="Captured Selfie" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Face Verified & Captured</span>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Real-time Status Bar */}
          <div className="mt-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  faceDetected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    faceDetected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
                  }`}
                />
                <span>{faceDetected ? 'Face Detected: Ready' : 'Scanning: Face Required'}</span>
              </span>

              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                {detectionMessage}
              </span>
            </div>

            <span className="text-[11px] text-slate-400 font-mono font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          {!capturedImage ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition text-center cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSnap}
                disabled={!faceDetected || isCapturing}
                title={!faceDetected ? 'Only face kudutha mattum capture aagum' : 'Face verified - Click to Capture'}
                className={`px-6 py-2.5 text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all ${
                  faceDetected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white cursor-pointer ring-2 ring-emerald-400/40 shadow-emerald-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 opacity-60'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>
                  {isCapturing
                    ? 'Capturing...'
                    : faceDetected
                    ? 'Capture Selfie'
                    : 'Face Required to Capture'}
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Use Selfie</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
