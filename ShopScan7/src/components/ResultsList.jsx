import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingDown } from "lucide-react";
import SearchResultCard from "./SearchResultCard";

export default function ResultsList({ search }) {
  if (!search || !search.results || search.results.length === 0) return null;

  const parsePrice = (priceStr) => {
    if (!priceStr) return Infinity;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? Infinity : num;
  };

  const sorted = [...search.results].sort(
    (a, b) => parsePrice(a.price) - parsePrice(b.price)
  );

  const cheapestPrice = parsePrice(sorted[0]?.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center shadow shadow-rose-200/50">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-rose-700" style={{ fontFamily: "'Playfair Display', serif" }}>
              {search.product_name || "Product Results"}
            </h2>
            <p className="text-xs text-pink-400">
              {search.results.length} deal{search.results.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 border border-pink-200">
          <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-xs font-medium text-rose-400">Sorted by price</span>
        </div>
      </div>

      {/* Product description */}
      {search.product_description && (
        <p className="text-sm text-rose-500 leading-relaxed bg-white/60 rounded-xl px-4 py-3 border border-pink-200/60">
          {search.product_description}
        </p>
      )}

      {/* Results grid */}
      <div className="grid gap-3">
        {sorted.map((result, index) => (
          <SearchResultCard
            key={index}
            result={result}
            index={index}
            isCheapest={parsePrice(result.price) === cheapestPrice}
          />
        ))}
      </div>
    </motion.div>
  );
}