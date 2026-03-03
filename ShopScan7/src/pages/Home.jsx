import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, History, X, Heart, Stars } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";
import ResultsList from "@/components/ResultsList";
import SearchHistoryItem from "@/components/SearchHistoryItem";

export default function Home() {
  const [activeSearch, setActiveSearch] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hint, setHint] = useState("");
  const queryClient = useQueryClient();

  const { data: searches = [] } = useQuery({
    queryKey: ["searches"],
    queryFn: () => base44.entities.ProductSearch.list("-created_date", 20),
  });

  const handleImageSelected = async (file) => {
    setIsProcessing(true);
    setActiveSearch(null);
    const currentHint = hint;

    // Upload image
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // Create search record
    const search = await base44.entities.ProductSearch.create({
      image_url: file_url,
      status: "searching",
    });
    setActiveSearch(search);
    queryClient.invalidateQueries({ queryKey: ["searches"] });

    // Identify product and find deals
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a product identification and price comparison expert. 
      
Look at this product image and:
1. Identify exactly what the product is (brand, model, specific variant if possible)
2. Search the internet for this exact product or very close alternatives
3. Find the cheapest buying options available online right now

${currentHint ? `Additional context from the user: "${currentHint}"` : ""}

Return the results as JSON. For the price field, always include the currency symbol (e.g. "$29.99").
For the shipping_cost field, include the shipping cost (e.g. "$4.99") or "Free shipping" if free, or "Unknown" if not available.
For the URL, provide the actual product page URL if you can find it, otherwise use "#".
Include notes like "Used", "Refurbished", "Limited time", estimated delivery, etc.`,
      file_urls: [file_url],
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          product_name: { type: "string", description: "The identified product name with brand/model" },
          product_description: { type: "string", description: "Brief description of the product" },
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                store: { type: "string", description: "Store/retailer name" },
                product_title: { type: "string", description: "Full product listing title" },
                price: { type: "string", description: "Price with currency symbol" },
                shipping_cost: { type: "string", description: "Shipping cost with currency symbol, or 'Free shipping' if free, or 'Unknown' if not available" },
                url: { type: "string", description: "Link to the product page" },
                notes: { type: "string", description: "Additional info like condition, estimated delivery, etc." },
              },
            },
          },
        },
      },
    });

    // Update record with results
    const updated = await base44.entities.ProductSearch.update(search.id, {
      product_name: result.product_name,
      product_description: result.product_description,
      results: result.results || [],
      status: "completed",
    });

    setActiveSearch(updated);
    setIsProcessing(false);
    queryClient.invalidateQueries({ queryKey: ["searches"] });
  };

  return (
    <div className="min-h-screen text-rose-950" style={{ background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 40%, #fdf2f8 70%, #fff5f9 100%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Decorative background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-pink-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-fuchsia-200/20 rounded-full blur-[80px]" />
        {/* Floating hearts decoration */}
        <div className="absolute top-20 right-20 text-pink-200 text-4xl opacity-40 select-none">✿</div>
        <div className="absolute top-40 left-16 text-rose-200 text-2xl opacity-30 select-none">♡</div>
        <div className="absolute bottom-32 left-24 text-pink-200 text-3xl opacity-30 select-none">✦</div>
        <div className="absolute bottom-20 right-32 text-fuchsia-200 text-2xl opacity-40 select-none">✿</div>
      </div>

      <div className="relative z-10">
        {/* Inspired by banner */}
        <div className="w-full bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 py-1.5 text-center">
          <p className="text-white text-xs font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
            ✨ inspired by Maggie Lewinsky ✨
          </p>
        </div>

        {/* Header */}
        <header className="border-b border-pink-200/60 backdrop-blur-xl bg-white/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-300/40">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-rose-600" style={{ fontFamily: "'Playfair Display', serif" }}>PriceSnap</h1>
                <p className="text-[10px] text-pink-400 uppercase tracking-widest font-medium">Find your best deal 🌸</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm text-rose-400 hover:text-rose-600 hover:bg-pink-100/70 transition-all border border-pink-200/60"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">History</span>
              {searches.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-400 text-[10px] text-white flex items-center justify-center font-bold">
                  {searches.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex">
          {/* History sidebar */}
          <AnimatePresence>
            {showHistory && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-r border-pink-200/50 h-[calc(100vh-93px)] overflow-hidden flex-shrink-0 bg-white/40 backdrop-blur-md"
              >
                <div className="w-[300px] p-4 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-rose-500">Recent Searches 🌷</h2>
                    <button onClick={() => setShowHistory(false)} className="text-pink-300 hover:text-rose-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {searches.length === 0 ? (
                    <p className="text-xs text-pink-300 text-center mt-8">No searches yet, darling 💕</p>
                  ) : (
                    <div className="space-y-1">
                      {searches.map((search, i) => (
                        <SearchHistoryItem
                          key={search.id}
                          search={search}
                          index={i}
                          isActive={activeSearch?.id === search.id}
                          onClick={() => {
                            setActiveSearch(search);
                            setIsProcessing(false);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto h-[calc(100vh-93px)]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
              {/* Hero section */}
              {!activeSearch && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-3 mb-4"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-xs text-rose-500 font-medium">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered Price Comparison
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-rose-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Snap it. Compare it.<br />
                    <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">Save money.</span>
                  </h2>
                  <p className="text-sm text-rose-400 max-w-md mx-auto leading-relaxed">
                    Upload a photo of anything you're obsessing over 💅 — our AI will find you the sweetest deals online.
                  </p>
                </motion.div>
              )}

              {/* Uploader */}
              <ImageUploader
                onImageSelected={handleImageSelected}
                isProcessing={isProcessing}
              />

              {/* Optional hint text */}
              {!isProcessing && (
                <div className="w-full max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={hint}
                      onChange={(e) => setHint(e.target.value)}
                      placeholder="Add a hint to help the AI (e.g. 'size medium', 'white color', 'Nike brand')…"
                      className="w-full px-5 py-3 rounded-2xl border border-pink-200/70 bg-white/60 backdrop-blur-sm text-sm text-rose-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 text-xs font-medium">optional</span>
                  </div>
                </div>
              )}

              {/* Results */}
              <AnimatePresence mode="wait">
                {activeSearch && activeSearch.status === "completed" && (
                  <ResultsList search={activeSearch} />
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}