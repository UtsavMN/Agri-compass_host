# 🎬 Animation & Motion Guide - Farmer's Platform

## Quick Reference

### Import Components
```tsx
// Scroll & Entry Animations
import { ScrollReveal, StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/animations';

// Loading States
import { CardSkeleton, Spinner, LoadingOverlay, LinearProgress } from '@/components/ui/loading-components';

// Typing Effects
import { Typewriter, AIMessage, TypingIndicator } from '@/components/ui/typing-animation';

// Hover Interactions
import { InteractiveCard, BounceButton, SpinIcon } from '@/components/ui/animations';
```

---

## 1. Entry & Scroll Animations

### Scroll Reveal (Framer Motion)
```tsx
// Single element reveal
<ScrollReveal direction="up" delay={0.2}>
  <Card>Your content</Card>
</ScrollReveal>

// Multiple cards with stagger
<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.name}</Card>
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Vanilla JavaScript Alternative
```javascript
// Using Intersection Observer API
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-100px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
};

// In HTML
<div class="scroll-reveal opacity-0">Content</div>

// In CSS
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
```

### Using AOS.js (Alternative Library)
```html
<!-- Add to index.html -->
<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
<script src="https://unpkg.com/aos@next/dist/aos.js"></script>

<!-- Initialize -->
<script>
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 100
  });
</script>

<!-- Use in components -->
<div data-aos="fade-up" data-aos-delay="200">
  <Card>Your content</Card>
</div>
```

---

## 2. Loading Skeletons & Progress

### Card Skeleton
```tsx
// React Component
{isLoading ? (
  <CardSkeleton count={3} />
) : (
  cards.map(card => <Card key={card.id}>{card}</Card>)
)}
```

### Vanilla JavaScript Skeleton
```html
<div class="skeleton-card">
  <div class="skeleton skeleton-avatar"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text short"></div>
</div>

<style>
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-text {
  height: 16px;
  margin: 8px 0;
}

.skeleton-text.short {
  width: 60%;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
```

### Progress Indicators
```tsx
// React - Linear Progress
<LinearProgress indeterminate /> // Infinite loading
<LinearProgress value={75} />    // 75% complete

// React - Step Progress
<StepProgress 
  steps={['Upload', 'Process', 'Complete']}
  currentStep={1}
/>

// React - Circular Progress
<CircularProgress progress={60} size={120} />
```

### Vanilla JavaScript Progress Bar
```javascript
function updateProgress(percent) {
  const bar = document.querySelector('.progress-bar');
  bar.style.width = percent + '%';
  bar.setAttribute('aria-valuenow', percent);
}

// HTML
<div class="progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar"></div>
</div>

// CSS
.progress {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #22c55e);
  transition: width 0.3s ease;
}
```

---

## 3. Hover & Click Micro-Interactions

### Interactive Cards (React)
```tsx
<InteractiveCard onClick={() => navigate('/details')}>
  <CardContent>
    <h3>Crop Information</h3>
  </CardContent>
</InteractiveCard>

// Or with custom animation
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  whileTap={{ scale: 0.98 }}
  className="card"
>
  Content
</motion.div>
```

### Vanilla JavaScript Hover Effects
```javascript
// Add hover lift effect
document.querySelectorAll('.card-hover').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = '0 10px 40px -10px rgba(0, 0, 0, 0.15)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 2px 15px -3px rgba(0, 0, 0, 0.07)';
  });
});

// CSS
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
```

### Button Ripple Effect (Vanilla JS)
```javascript
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
  ripple.classList.add('ripple');
  
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) existingRipple.remove();
  
  button.appendChild(ripple);
}

document.querySelectorAll('.ripple-button').forEach(button => {
  button.addEventListener('click', createRipple);
});

// CSS
.ripple-button {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

---

## 4. Typing Animation for AI Responses

### React - Typewriter Effect
```tsx
// Simple typewriter
<Typewriter 
  text="Hello! I'm your AI farming assistant. How can I help you today?"
  speed={50}
  onComplete={() => setShowActions(true)}
/>

// Full AI message with avatar
<AIMessage 
  message="Based on your location, I recommend planting rice during monsoon season..."
  speed={30}
/>

// Typing indicator (while waiting)
<TypingIndicator />
```

### Vanilla JavaScript Typewriter
```javascript
class Typewriter {
  constructor(element, text, options = {}) {
    this.element = element;
    this.text = text;
    this.speed = options.speed || 50;
    this.onComplete = options.onComplete || null;
    this.index = 0;
  }
  
  type() {
    if (this.index < this.text.length) {
      this.element.textContent += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    } else if (this.onComplete) {
      this.onComplete();
    }
  }
  
  start() {
    this.element.textContent = '';
    this.index = 0;
    this.type();
  }
}

// Usage
const aiMessage = document.querySelector('.ai-message');
const typewriter = new Typewriter(
  aiMessage,
  'Hello! How can I help you?',
  { speed: 50, onComplete: () => console.log('Done!') }
);
typewriter.start();
```

### Streaming API Response (React Hook)
```tsx
import { useStreamingText } from '@/components/ui/typing-animation';

function AIChat() {
  const { text, append, clear } = useStreamingText();
  
  const handleStreamResponse = async () => {
    clear();
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Tell me about rice farming' })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      append(chunk);
    }
  };
  
  return <div>{text}</div>;
}
```

---

## 5. Smooth Page Transitions

### React Router with Framer Motion
```tsx
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PageTransition } from '@/components/ui/animations';

function App() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/dashboard" element={
          <PageTransition>
            <DashboardPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}
```

### Vanilla JavaScript Page Transitions
```javascript
// Router simulation
function navigateTo(path) {
  const currentPage = document.querySelector('.page.active');
  const newPage = document.querySelector(`[data-page="${path}"]`);
  
  // Fade out current
  currentPage.classList.add('fade-out');
  
  setTimeout(() => {
    currentPage.classList.remove('active', 'fade-out');
    newPage.classList.add('active', 'fade-in');
    
    setTimeout(() => {
      newPage.classList.remove('fade-in');
    }, 300);
  }, 300);
}

// CSS
.page {
  display: none;
  opacity: 0;
}

.page.active {
  display: block;
  opacity: 1;
}

.fade-out {
  animation: fadeOut 0.3s ease-out forwards;
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeOut {
  to { opacity: 0; transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Usage Examples

### Complete Dashboard Example
```tsx
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { CardSkeleton, LinearProgress } from '@/components/ui/loading-components';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header with fade in */}
        <FadeIn delay={0.1}>
          <h1>Welcome to Your Dashboard</h1>
        </FadeIn>
        
        {/* Progress indicator */}
        {loading && <LinearProgress indeterminate />}
        
        {/* Cards with scroll reveal */}
        <ScrollReveal direction="up">
          {loading ? (
            <CardSkeleton count={3} />
          ) : (
            <StaggerContainer>
              {cards.map(card => (
                <StaggerItem key={card.id}>
                  <InteractiveCard onClick={() => handleClick(card)}>
                    <CardContent>{card.title}</CardContent>
                  </InteractiveCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
```

### AI Chat Example
```tsx
import { AIMessage, TypingIndicator } from '@/components/ui/typing-animation';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const sendMessage = async (text) => {
    setIsTyping(true);
    const response = await fetchAIResponse(text);
    setIsTyping(false);
    setMessages(prev => [...prev, { text: response, type: 'ai' }]);
  };
  
  return (
    <div className="space-y-4">
      {messages.map((msg, i) => (
        msg.type === 'ai' ? (
          <AIMessage key={i} message={msg.text} speed={30} />
        ) : (
          <UserMessage key={i}>{msg.text}</UserMessage>
        )
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
}
```

---

## Performance Tips

1. **Use CSS transforms** instead of absolute positioning for animations
2. **Debounce scroll listeners** for scroll-based animations
3. **Lazy load** heavy animation libraries
4. **Reduce motion** for users with motion sensitivity:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
5. **Use `will-change`** sparingly for GPU acceleration
6. **Limit concurrent animations** to 3-5 elements at once

---

## Browser Support

- Framer Motion: Modern browsers (Chrome 90+, Safari 14+, Firefox 88+)
- Intersection Observer: All modern browsers
- CSS Animations: Universal support
- Vanilla JS: Universal support

---

## Next Steps

1. Import animation components into your pages
2. Replace static content with animated versions
3. Add loading skeletons to all data fetching
4. Implement AI typing effect in chat interface
5. Test on mobile devices for smooth 60fps animations
