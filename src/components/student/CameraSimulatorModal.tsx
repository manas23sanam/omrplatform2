import React, { useState } from 'react';
import { Camera, X, Check, RefreshCw, Sparkles, Crosshair } from 'lucide-react';

interface CameraSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  categoryLabel?: string;
}

export const CameraSimulatorModal: React.FC<CameraSimulatorModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  categoryLabel = 'Full Paper',
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerCapture = () => {
    setIsCapturing(true);

    // Simulate shutter flash and image capture
    setTimeout(() => {
      // Create a simulated high-contrast scanned OMR image data URL
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // White background paper
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 800, 1100);

        // Header header banner
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(40, 40, 720, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('Riyoshi Coaching - NEET DIVISION', 60, 80);
        ctx.font = '16px sans-serif';
        ctx.fillText(`CANDIDATE OMR ANSWER SHEET • ${categoryLabel.toUpperCase()}`, 60, 110);

        // Fiducial corner markers
        ctx.fillStyle = '#000000';
        ctx.fillRect(30, 30, 24, 24); // TL
        ctx.fillRect(746, 30, 24, 24); // TR
        ctx.fillRect(30, 1046, 24, 24); // BL
        ctx.fillRect(746, 1046, 24, 24); // BR

        // Grid columns of questions & bubbles
        const cols = 3;
        const qPerCol = 30;
        const colWidth = 230;

        for (let c = 0; c < cols; c++) {
          const startX = 50 + c * colWidth;
          for (let q = 1; q <= qPerCol; q++) {
            const qNum = c * qPerCol + q;
            const y = 160 + q * 28;

            ctx.fillStyle = '#334155';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(`Q${qNum < 10 ? '0' + qNum : qNum}`, startX, y);

            // 4 options: A, B, C, D
            const markedIdx = (qNum * 7) % 4; // simulated marked option
            ['A', 'B', 'C', 'D'].forEach((opt, optIdx) => {
              const bubbleX = startX + 45 + optIdx * 34;
              ctx.beginPath();
              ctx.arc(bubbleX, y - 4, 8, 0, Math.PI * 2);

              if (optIdx === markedIdx && qNum % 7 !== 0) {
                // Filled bubble (dark pencil)
                ctx.fillStyle = '#1e293b';
                ctx.fill();
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 1.5;
                ctx.stroke();
              } else {
                // Empty bubble
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 1.2;
                ctx.stroke();
                ctx.fillStyle = '#64748b';
                ctx.font = '10px sans-serif';
                ctx.fillText(opt, bubbleX - 3.5, y - 1);
              }
            });
          }
        }

        // Barcode at bottom
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(280, 1040, 240, 25);
      }

      const generatedDataUrl = canvas.toDataURL('image/png');
      setCapturedPreview(generatedDataUrl);
      setIsCapturing(false);
      setHasCaptured(true);
    }, 600);
  };

  const handleAcceptCapture = () => {
    if (capturedPreview) {
      onCapture(capturedPreview);
      onClose();
    }
  };

  const handleRetake = () => {
    setHasCaptured(false);
    setCapturedPreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/80 flex items-center justify-center text-white">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">OMR Optical Camera Scanner</h3>
              <p className="text-[11px] text-slate-400">Position sheet inside the 4 corner alignment brackets</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder Container */}
        <div className="relative p-6 flex flex-col items-center justify-center bg-slate-950 min-h-[380px]">
          {/* Shutter flash overlay */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white z-30 animate-in fade-in fade-out duration-300" />
          )}

          {!hasCaptured ? (
            /* Live Simulated Camera Viewfinder */
            <div className="relative w-full max-w-md aspect-[3/4] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-between p-4 shadow-inner">
              {/* Corner Fiducials Reticles */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-slate-400 rounded-tl-lg animate-pulse" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-slate-400 rounded-tr-lg animate-pulse" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-slate-400 rounded-bl-lg animate-pulse" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-slate-400 rounded-br-lg animate-pulse" />

              {/* Center crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <Crosshair size={48} className="text-slate-400" />
              </div>

              {/* Simulated Sheet Background Texture */}
              <div className="w-4/5 h-4/5 bg-white/5 border border-dashed border-slate-500/40 rounded-xl flex flex-col items-center justify-center p-4 text-center my-auto">
                <p className="font-mono text-xs text-slate-300 font-bold uppercase tracking-widest">
                  OMR ALIGNMENT RETICLE
                </p>
                <p className="text-[11px] text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Hold camera steady parallel to sheet. Keep lighting uniform.
                </p>
              </div>

              {/* Telemetry Pills */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping" />
                  FEED: 1080P HD
                </span>
                <span>DESKEW: 0.1°</span>
                <span className="text-slate-400">EXPOSURE: OPTIMAL</span>
              </div>
            </div>
          ) : (
            /* Captured Image Preview */
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-500 shadow-xl bg-white flex items-center justify-center">
              {capturedPreview && (
                <img
                  src={capturedPreview}
                  alt="Captured OMR"
                  className="w-full h-full object-contain bg-white"
                />
              )}
              <div className="absolute top-3 right-3 bg-slate-600 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
                <Check size={12} />
                Fiducials Locked
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          {!hasCaptured ? (
            <>
              <p className="text-xs text-slate-400">
                Category: <strong className="text-white">{categoryLabel}</strong>
              </p>

              <button
                type="button"
                onClick={handleTriggerCapture}
                disabled={isCapturing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-500 to-blue-600 hover:from-slate-600 hover:to-blue-700 text-white font-black text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Camera size={16} />
                Capture OMR Photo
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                Retake
              </button>

              <button
                type="button"
                onClick={handleAcceptCapture}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Check size={16} />
                Use Captured OMR
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

