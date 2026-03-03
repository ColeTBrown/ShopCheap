import React from "react";
import { ExternalLink, Tag, Store, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function SearchResultCard({ result, index, isCheapest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div
        className={`
          relative group rounded-2xl border transition-all duration-300 overflow-hidden
          ${isCheapest
            ? "border-rose-300/60 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg shadow-rose-200/40"
            : "border-pink-200/50 bg-white/60 hover:border-rose-300/60 hover:bg-pink-50/60"
          }
        `}
      >
        {isCheapest && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400" />
        )}

        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Store className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">
                  {result.store}
                </span>
                {isCheapest && (
                  <Badge className="bg-rose-100 text-rose-500 border-rose-200 text-[10px] px-2 py-0">
                    ✨ Best Price
                  </Badge>
                )}
              </div>
              <h3 className="text-sm font-semibold text-rose-800 line-clamp-2 leading-snug">
                {result.product_title}
              </h3>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className={`text-2xl font-bold tracking-tight ${isCheapest ? "text-rose-500" : "text-rose-700"}`}>
                {result.price}
              </p>
              {result.shipping_cost && (
                <p className={`text-xs mt-0.5 flex items-center gap-1 ${result.shipping_cost === "Free shipping" ? "text-green-500 font-medium" : "text-pink-400"}`}>
                  <Truck className="w-3 h-3" />
                  {result.shipping_cost}
                </p>
              )}
              {result.notes && (
                <p className="text-xs text-pink-400 mt-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {result.notes}
                </p>
              )}
            </div>

            {result.url && result.url !== "#" && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200
                  ${isCheapest
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400 shadow-lg shadow-rose-300/30"
                    : "bg-pink-100 text-rose-500 hover:bg-pink-200 hover:text-rose-600 border border-pink-200"
                  }
                `}
                onClick={(e) => e.stopPropagation()}
              >
                View Deal
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}