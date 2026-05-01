# 🌾 Farmer's Platform - Design System

## Color Palette

### Primary (Leaf Green)
```css
leaf-50:  #f0fdf4  /* Lightest backgrounds */
leaf-100: #dcfce7  /* Card backgrounds, subtle highlights */
leaf-200: #bbf7d0  /* Borders, dividers */
leaf-500: #22c55e  /* Primary actions (lighter) */
leaf-600: #16a34a  /* PRIMARY - Main actions, buttons */
leaf-700: #15803d  /* Hover states */
leaf-900: #14532d  /* Dark text, headings */
```

### Secondary (Earth)
```css
earth-50:  #fefce8  /* Warning backgrounds */
earth-100: #fef9c3  /* Highlights */
earth-500: #eab308  /* Warning actions */
earth-800: #854d0e  /* Secondary dark text */
```

### Accent (Sky Blue)
```css
sky-50:  #f0f9ff   /* Weather/water backgrounds */
sky-500: #0ea5e9   /* Weather icons, water data */
sky-700: #0369a1   /* Hover states */
```

### Neutral (Slate)
```css
slate-50:  #f8fafc  /* Page backgrounds */
slate-100: #f1f5f9  /* Card backgrounds */
slate-600: #475569  /* Body text */
slate-900: #0f172a  /* Headings */
```

## Typography

### Font Families
- **Primary**: 'Inter', system-ui, sans-serif
- **Kannada**: 'Noto Sans Kannada', sans-serif

### Scale
```
Hero:     3rem (48px)     - font-bold
H1:       2.25rem (36px)  - font-bold
H2:       1.875rem (30px) - font-semibold
H3:       1.5rem (24px)   - font-semibold
Body:     1rem (16px)     - font-normal
Small:    0.875rem (14px) - font-normal
```

## Spacing & Layout

### Container
- Max width: 1280px (7xl)
- Padding: px-4 sm:px-6 lg:px-8

### Cards
- Border radius: rounded-xl (0.75rem)
- Padding: p-6 (24px)
- Shadow: shadow-soft
- Hover: shadow-soft-lg + translate-y-1

### Grid Breakpoints
```
sm:  640px   - 2 columns
md:  768px   - 3 columns
lg:  1024px  - 4 columns
xl:  1280px  - 6 columns
```

## Components

### Card
```tsx
<Card className="rounded-xl shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-leaf-600" />
      Title
    </CardTitle>
  </CardHeader>
  <CardContent className="p-6">
    Content
  </CardContent>
</Card>
```

### Button - Primary
```tsx
<Button className="bg-leaf-600 hover:bg-leaf-700 active:scale-95 shadow-sm hover:shadow-md transition-all duration-200">
  Action
</Button>
```

### Button - Secondary
```tsx
<Button variant="outline" className="border-leaf-200 text-leaf-700 hover:bg-leaf-50 active:scale-95">
  Secondary
</Button>
```

### Input Field
```tsx
<Input className="border-slate-200 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 transition-all" />
```

## Micro-Interactions

### Hover States
```css
/* Cards */
hover:shadow-soft-lg hover:-translate-y-1

/* Buttons */
hover:bg-leaf-700 hover:shadow-md

/* Links/Icons */
hover:text-leaf-600 hover:scale-105
```

### Active States
```css
active:scale-95  /* All clickable elements */
```

### Focus States
```css
focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2
```

### Loading States
```css
animate-pulse-soft  /* Shimmer effect */
```

### Transitions
```css
transition-all duration-200  /* Fast interactions */
transition-all duration-300  /* Medium animations */
transition-all duration-500  /* Slow, smooth */
```

## Layout Patterns

### Desktop (1024px+)
```
┌─────────────────────────────────────┐
│  Header (Glass Effect)              │
│  Logo | Nav | District | Profile    │
├──────┬──────────────────────────────┤
│      │                              │
│ Side │   Content Grid               │
│ bar  │   [Card] [Card] [Card]       │
│      │   [Card] [Card] [Card]       │
│      │                              │
└──────┴────────────────────┬─────────┘
                            │ AI FAB
                            └─────────
```

### Mobile (< 768px)
```
┌─────────────────────┐
│  Sticky Header      │
│  Logo | Hamburger   │
├─────────────────────┤
│                     │
│  Full Width Content │
│  [Card]             │
│  [Card]             │
│                     │
├─────────────────────┤
│  Bottom Navigation  │
│  🏠 🌾 📊 🤖       │
└─────────────────────┘
```

## Accessibility

### Focus Visible
- 2px solid ring in leaf-500
- Offset by 2px for clarity

### Color Contrast
- Text on white: slate-900 (AAA)
- Text on leaf-600: white (AAA)
- Borders: slate-200 (AA)

### Touch Targets
- Minimum: 44px x 44px
- Spacing: min 8px between

## Animation Guidelines

### Entry Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Stagger Children
```tsx
transition={{ duration: 0.3, delay: index * 0.1 }}
```

### Hover Scale
```tsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

## Glass Effect (Nav)
```css
.glass-effect {
  @apply bg-white/80 backdrop-blur-md border border-white/20;
}
```

## Usage Examples

### Quick Action Card
```tsx
<Card className="card-hover cursor-pointer">
  <CardContent className="p-6 text-center">
    <div className="bg-leaf-600 p-3 rounded-full w-fit mx-auto mb-3">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="font-semibold">Title</h3>
    <p className="text-sm text-slate-600">Description</p>
  </CardContent>
</Card>
```

### Floating AI Button
```tsx
<Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow bg-leaf-600 hover:bg-leaf-700 z-50">
  <Sparkles className="h-6 w-6" />
</Button>
```

### Filter Sidebar
```tsx
<aside className="w-72 space-y-4">
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Filters</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Input className="input-field" placeholder="Search..." />
      <Select>...</Select>
    </CardContent>
  </Card>
</aside>
```
