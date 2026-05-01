import Lottie from 'lottie-react';

// Simple loading animation data (inline to avoid external dependencies)
const loadingAnimationData = {
  v: '5.7.1',
  meta: { g: 'LottieFiles AE 0.1.20' },
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: 'Loading Animation',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Shape Layer 1',
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [100, 100, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [40, 40], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 }
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.22, 0.78, 0.38, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 4, ix: 5 },
              lc: 1,
              lj: 1,
              ml: 4,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 }
            }
          ],
          nm: 'Ellipse 1',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false
        },
        {
          ty: 'tm',
          s: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] },
              { t: 60, s: [100] }
            ],
            ix: 1
          },
          e: {
            a: 1,
            k: [
              { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [25] },
              { t: 60, s: [125] }
            ],
            ix: 2
          },
          o: { a: 0, k: 0, ix: 3 },
          m: 1,
          ix: 2,
          nm: 'Trim Paths 1',
          mn: 'ADBE Vector Filter - Trim',
          hd: false
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

interface LottieLoadingProps {
  size?: number;
  className?: string;
}

export default function LottieLoading({ size = 100, className = '' }: LottieLoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie
        animationData={loadingAnimationData}
        loop={true}
        style={{ width: size, height: size }}
      />
    </div>
  );
}

// Empty state animation
const emptyStateAnimationData = {
  v: '5.7.1',
  meta: { g: 'LottieFiles AE 0.1.20' },
  fr: 30,
  ip: 0,
  op: 120,
  w: 300,
  h: 200,
  nm: 'Empty State',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Box',
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [150, 120, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'rc',
              d: 1,
              s: { a: 0, k: [80, 60], ix: 2 },
              r: { a: 0, k: 8, ix: 3 },
              p: { a: 0, k: [0, 0], ix: 3 }
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.93, 0.95, 0.97, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: 'Fill 1',
              mn: 'ADBE Vector Graphic - Fill',
              hd: false
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.8, 0.85, 0.9, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 1, ix: 5 },
              lc: 1,
              lj: 1,
              ml: 4,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false
            }
          ],
          nm: 'Rectangle 1',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Search Icon',
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [150, 80, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [30, 30], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 }
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.6, 0.65, 0.7, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 2, ix: 5 },
              lc: 1,
              lj: 1,
              ml: 4,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false
            }
          ],
          nm: 'Circle',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false
        },
        {
          ty: 'gr',
          it: [
            {
              ty: 'rc',
              d: 1,
              s: { a: 0, k: [15, 2], ix: 2 },
              r: { a: 0, k: 1, ix: 3 },
              p: { a: 0, k: [12, 12], ix: 3 }
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.6, 0.65, 0.7, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: 'Fill 1',
              mn: 'ADBE Vector Graphic - Fill',
              hd: false
            }
          ],
          nm: 'Handle',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
          mn: 'ADBE Vector Group',
          hd: false
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

interface LottieEmptyStateProps {
  size?: number;
  className?: string;
  message?: string;
}

export function LottieEmptyState({
  size = 200,
  className = '',
  message = 'No data available'
}: LottieEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Lottie
        animationData={emptyStateAnimationData}
        loop={true}
        style={{ width: size, height: size * 0.67 }}
      />
      <p className="text-gray-500 text-center mt-4">{message}</p>
    </div>
  );
}
