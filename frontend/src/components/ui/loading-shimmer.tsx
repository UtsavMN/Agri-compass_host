import { motion } from 'framer-motion';

interface LoadingShimmerProps {
  className?: string;
  height?: string;
  width?: string;
}

export function LoadingShimmer({ className = '', height = 'h-4', width = 'w-full' }: LoadingShimmerProps) {
  return (
    <div className={`${width} ${height} ${className} bg-gray-200 rounded animate-pulse overflow-hidden relative`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}

interface CardShimmerProps {
  className?: string;
}

export function CardShimmer({ className = '' }: CardShimmerProps) {
  return (
    <div className={`bg-white rounded-lg border p-6 space-y-4 ${className}`}>
      <LoadingShimmer height="h-6" width="w-3/4" />
      <LoadingShimmer height="h-4" width="w-full" />
      <LoadingShimmer height="h-4" width="w-5/6" />
      <div className="flex gap-4">
        <LoadingShimmer height="h-8" width="w-20" />
        <LoadingShimmer height="h-8" width="w-16" />
      </div>
    </div>
  );
}

interface CropCardShimmerProps {
  count?: number;
}

export function CropCardShimmer({ count = 4 }: CropCardShimmerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CardShimmer key={index} className="animate-pulse" />
      ))}
    </div>
  );
}
