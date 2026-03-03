import React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Loader2 } from "lucide-react";
import moment from "moment";

export default function SearchHistoryItem({ search, onClick, isActive, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200
        ${isActive
          ? "bg-pink-100 border border-rose-300/50"
          : "hover:bg-pink-50 border border-transparent"
        }
      `}
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
        {search.image_url ? (
          <img
            src={search.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-rose-700 truncate">
          {search.product_name || "Identifying..."}
        </p>
        <p className="text-xs text-pink-400">
          {moment(search.created_date).fromNow()}
        </p>
      </div>
      {search.status === "searching" ? (
        <Loader2 className="w-4 h-4 text-rose-400 animate-spin flex-shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 text-pink-300 flex-shrink-0" />
      )}
    </motion.button>
  );
}