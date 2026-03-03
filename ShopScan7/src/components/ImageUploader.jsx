import React, { useState, useRef } from "react";
import { Upload, Camera, ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageUploader({ onImageSelected, isProcessing }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onImageSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden
          ${dragOver
            ? "border-pink-400 bg-pink-100/60 scale-[1.02]"
            : "border-pink-300/50 bg-white/50 hover:border-rose-400/70 hover:bg-pink-50/60"
          }
          ${preview ? "p-4" : "p-12 md:p-16"}
        `}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={preview}
                  alt="Product preview"
                  className="w-full h-64 object-cover"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-pink-50/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
                      <p className="text-sm text-rose-500 font-medium">Finding you the best deals ✨</p>
                    </div>
                  </div>
                )}
              </div>
              {!isProcessing && (
                <p className="text-xs text-slate-400">Click to upload a different image</p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center shadow-lg shadow-pink-200/50">
                  <Camera className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-300/40">
                  <Upload className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-rose-600">
                  Drop your product image here 🌸
                </h3>
                <p className="text-sm text-rose-400 max-w-xs">
                  Upload a photo of anything you're eyeing — we'll hunt down the best price for you
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-pink-400">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>PNG, JPG, WEBP supported</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </motion.div>
  );
}