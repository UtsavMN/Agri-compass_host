# 🎯 Micro-Interactions Guide

## Hover States

### Cards
```tsx
// Basic hover lift
className="transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1"

// With scale
className="transition-all duration-300 hover:scale-[1.02] hover:shadow-soft-lg"

// Framer Motion
<motion.div
  whileHover={{ y: -4, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)' }}
  transition={{ duration: 0.2 }}
>
```

### Buttons
```tsx
// Primary button
className="bg-leaf-600 hover:bg-leaf-700 hover:shadow-md active:scale-95 transition-all duration-200"

// Icon button
className="hover:bg-leaf-50 hover:text-leaf-600 hover:scale-110 transition-all duration-200"

// Framer Motion
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### Links & Text
```tsx
// Underline animation
className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-leaf-600 hover:after:w-full after:transition-all after:duration-300"

// Color change
className="text-slate-600 hover:text-leaf-600 transition-colors duration-200"
```

### Images
```tsx
// Zoom on hover
<div className="overflow-hidden rounded-xl">
  <img className="transition-transform duration-500 hover:scale-110" />
</div>

// Overlay reveal
className="group relative">
  <img />
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
</div>
```

## Focus States

### Inputs
```tsx
className="border-slate-200 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 focus:ring-offset-2 transition-all duration-200"
```

### Buttons
```tsx
className="focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 outline-none"
```

### Cards (Keyboard Navigation)
```tsx
className="focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-4 outline-none"
```

## Active/Pressed States

### All Clickable Elements
```tsx
className="active:scale-95 transition-transform duration-100"
```

### Buttons
```tsx
className="active:scale-95 active:shadow-sm transition-all duration-100"
```

## Loading States

### Skeleton Shimmer
```tsx
// Pulse animation
className="animate-pulse-soft bg-slate-100 rounded-xl h-24"

// Shimmer gradient
className="relative overflow-hidden bg-slate-100 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

// In tailwind.config.js, add:
keyframes: {
  shimmer: {
    '100%': { transform: 'translateX(100%)' }
  }
}
```

### Spinner
```tsx
<div className="animate-spin h-5 w-5 border-2 border-leaf-600 border-t-transparent rounded-full" />
```

### Button Loading
```tsx
<Button disabled className="opacity-70 cursor-not-wait">
  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
  Loading...
</Button>
```

## Entry Animations

### Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

### Slide Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

### Scale In
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
```

### Stagger Children
```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

## Toast/Notification Animations

### Slide In from Right
```tsx
<motion.div
  initial={{ x: 300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 300, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
```

## Modal/Dialog Animations

### Backdrop Fade
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-black/50"
/>
```

### Modal Scale
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
```

## Icon Animations

### Spin on Hover
```tsx
className="transition-transform duration-300 hover:rotate-90"
```

### Bounce
```tsx
className="animate-bounce"
```

### Pulse (Notification Dot)
```tsx
<span className="relative">
  <Bell className="h-5 w-5" />
  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping" />
  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
</span>
```

## Form Field Interactions

### Label Float
```tsx
<div className="relative">
  <input
    className="peer pt-6 pb-2 px-4 border rounded-lg focus:border-leaf-500"
    placeholder=" "
  />
  <label className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-leaf-600 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
    Label
  </label>
</div>
```

### Success/Error State
```tsx
// Success
className="border-green-500 focus:ring-green-100"

// Error
className="border-red-500 focus:ring-red-100 shake"

// In CSS
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
```

## Page Transitions

### Fade In Content
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

## Number Counter Animation
```tsx
import { useEffect, useState } from 'react';

function Counter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  
  return <span>{count}</span>;
}
```

## Ripple Effect (Material Design)
```tsx
function RippleButton({ children, onClick }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = { x, y, size, id: Date.now() };
    setRipples([...ripples, newRipple]);
    
    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      className="relative overflow-hidden"
      onClick={(e) => {
        addRipple(e);
        onClick?.(e);
      }}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-[ripple_0.6s_ease-out]"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {children}
    </button>
  );
}

// In tailwind.config
keyframes: {
  ripple: {
    '0%': { transform: 'scale(0)', opacity: 1 },
    '100%': { transform: 'scale(4)', opacity: 0 }
  }
}
```

## Scroll Reveal
```tsx
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function ScrollReveal({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

## Usage Recommendations

### Performance Tips
1. Use `transform` and `opacity` for animations (GPU accelerated)
2. Avoid animating `width`, `height`, or `margin`
3. Use `will-change` sparingly
4. Prefer CSS transitions for simple interactions
5. Use Framer Motion for complex orchestrations

### Timing
- **Fast (100-200ms)**: Button clicks, checkboxes
- **Medium (200-400ms)**: Card hovers, dropdowns
- **Slow (400-600ms)**: Page transitions, modals

### Easing
- `ease-out`: Elements entering the screen
- `ease-in`: Elements leaving the screen
- `ease-in-out`: Elements moving within the screen
