import React from "react";
import { motion } from "framer-motion";

/**
 * Premium Shimmer Skeleton Component
 * Matches the gaming/cyberpunk aesthetic of SocialMedfun.
 */
export const Skeleton = ({ className, width, height, rounded = "rounded-xl" }) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-800/40 ${rounded} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
};

export const PostSkeleton = () => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton width="48px" height="48px" rounded="rounded-full" />
      <div className="space-y-2">
        <Skeleton width="120px" height="14px" />
        <Skeleton width="80px" height="10px" />
      </div>
    </div>
    <Skeleton className="w-full" height="300px" />
    <div className="flex gap-4">
      <Skeleton width="40px" height="20px" rounded="rounded-full" />
      <Skeleton width="40px" height="20px" rounded="rounded-full" />
    </div>
  </div>
);

export const StorySkeleton = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton width="64px" height="64px" rounded="rounded-full" />
    <Skeleton width="48px" height="10px" />
  </div>
);
