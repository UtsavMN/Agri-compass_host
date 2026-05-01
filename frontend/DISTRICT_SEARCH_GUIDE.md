# 🗺️ Enhanced District Search & Filter System

## Overview

This guide shows how to implement an improved district search system with:
- ✅ **All 32 districts** visible in dropdown
- ✅ **Fuzzy search** with typo tolerance
- ✅ **Autocomplete** with keyboard navigation
- ✅ **Instant updates** without page reload
- ✅ **Lightweight** using Fuse.js (2KB gzipped)

---

## Installation

### Step 1: Install Fuse.js

```bash
npm install fuse.js
```

Or with yarn:
```bash
yarn add fuse.js
```

---

## Files Created

1. **`src/hooks/useDistrictSearch.ts`** - Search hook with Fuse.js integration
2. **`src/components/ui/district-search.tsx`** - Enhanced UI component
3. **`src/pages/Dashboard.enhanced-search.tsx`** - Integration example

---

## Quick Start

### Basic Usage

```tsx
import { useState, useEffect } from 'react';
import { DistrictSearch } from '@/components/ui/district-search';
import { useDistrictSearch, loadDistrictsFromCSV } from '@/hooks/useDistrictSearch';

function MyComponent() {
  const [districts, setDistricts] = useState([]);

  // Load districts from CSV
  useEffect(() => {
    const loadData = async () => {
      const data = await loadDistrictsFromCSV('/districts.csv');
      setDistricts(data);
    };
    loadData();
  }, []);

  // Use the search hook
  const {
    searchQuery,
    selectedDistrict,
    selectedDistrictData,
    searchResults,
    setSearchQuery,
    setSelectedDistrict,
  } = useDistrictSearch(districts, {
    threshold: 0.3, // Fuzzy match threshold
    keys: ['district', 'recommended_crops', 'soil_type'],
    limit: 32, // Show all districts
  });

  return (
    <div>
      <DistrictSearch
        districts={districts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        placeholder="Search districts..."
      />

      {/* Show selected district data */}
      {selectedDistrictData && (
        <div>
          <h2>{selectedDistrictData.district}</h2>
          <p>Crops: {selectedDistrictData.recommended_crops}</p>
          <p>Soil: {selectedDistrictData.soil_type}</p>
          <p>Rainfall: {selectedDistrictData.avg_rainfall}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Features Explained

### 1️⃣ Fuzzy Search with Fuse.js

**How it works:**
- Searches across multiple fields (district name, crops, soil type)
- Tolerates typos and partial matches
- Ranks results by relevance

**Example searches:**
```
"banga" → Finds "Bengaluru Urban", "Bengaluru Rural"
"coffe" → Finds "Chikkamagaluru", "Kodagu" (coffee regions)
"cotton" → Finds all cotton-growing districts
"black soil" → Finds districts with black soil
```

**Configuration:**
```tsx
const fuse = new Fuse(districts, {
  keys: ['district', 'recommended_crops', 'soil_type'],
  threshold: 0.3, // 0.0 = exact match, 1.0 = match anything
  includeScore: true,
  minMatchCharLength: 1,
  shouldSort: true, // Rank by relevance
});
```

**Adjusting sensitivity:**
```tsx
threshold: 0.1  // Strict (fewer results, more accurate)
threshold: 0.3  // Balanced (recommended)
threshold: 0.5  // Loose (more results, less accurate)
```

---

### 2️⃣ Autocomplete with Keyboard Navigation

**Keyboard shortcuts:**
- `↓` Arrow Down - Move to next result
- `↑` Arrow Up - Move to previous result
- `Enter` - Select highlighted district
- `Esc` - Close dropdown

**Implementation:**
```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setFocusedIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
      break;
    case 'ArrowUp':
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
      break;
    case 'Enter':
      if (focusedIndex >= 0) {
        handleSelect(results[focusedIndex].district);
      }
      break;
    case 'Escape':
      setIsOpen(false);
      break;
  }
};
```

---

### 3️⃣ Instant Updates (No Page Reload)

**How it works:**
- Uses React state for real-time updates
- Debounced search for performance
- Optimistic UI updates

**Example with debouncing:**
```tsx
import { useState, useEffect } from 'react';

function useDebounce(value: string, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// In component
const debouncedQuery = useDebounce(searchQuery, 300);

useEffect(() => {
  if (debouncedQuery) {
    // Perform search with debounced value
  }
}, [debouncedQuery]);
```

---

### 4️⃣ All Districts Visible

**Default behavior:**
- Shows all 32 districts when dropdown opens
- Filters as user types
- Always accessible via scroll

**Configuration:**
```tsx
<DistrictSearch
  showAllOnFocus={true} // Show all districts on focus
  searchResults={searchQuery ? searchResults : districts} // All or filtered
/>
```

---

## Integration with Existing Data

### Option 1: Load from CSV (Recommended)

```tsx
import { loadDistrictsFromCSV } from '@/hooks/useDistrictSearch';

useEffect(() => {
  const loadData = async () => {
    const districts = await loadDistrictsFromCSV('/districts.csv');
    setDistricts(districts);
  };
  loadData();
}, []);
```

### Option 2: Use Existing State

If you already have district data loaded:

```tsx
// Your existing code
const [districtData, setDistrictData] = useState([]);

// Use with search hook
const {
  selectedDistrict,
  setSelectedDistrict,
  // ... other values
} = useDistrictSearch(districtData, {
  threshold: 0.3,
});
```

### Option 3: Parse CSV String

```tsx
import { parseDistrictCSV } from '@/hooks/useDistrictSearch';

const csvString = `district,recommended_crops,soil_type,avg_rainfall,weather_pattern
Bengaluru Urban,Ragi, Groundnut, Vegetables,Red sandy,800mm,Semi-arid
...`;

const districts = parseDistrictCSV(csvString);
```

---

## Advanced Usage

### Custom Search Keys

Search specific fields only:

```tsx
useDistrictSearch(districts, {
  keys: ['district'], // Search only district names
});

// Or search multiple fields
useDistrictSearch(districts, {
  keys: ['district', 'recommended_crops', 'soil_type', 'weather_pattern'],
});
```

### Limit Results

```tsx
useDistrictSearch(districts, {
  limit: 5, // Show only top 5 results
});
```

### Initial Selection

```tsx
useDistrictSearch(districts, {
  initialDistrict: 'Bengaluru Urban', // Pre-select district
});

// Or use profile data
useDistrictSearch(districts, {
  initialDistrict: profile?.location || '',
});
```

### Access Selected District Data

```tsx
const { selectedDistrictData } = useDistrictSearch(districts);

// selectedDistrictData contains:
{
  district: "Bengaluru Urban",
  recommended_crops: "Ragi, Groundnut, Vegetables",
  soil_type: "Red sandy",
  avg_rainfall: "800mm",
  weather_pattern: "Semi-arid"
}
```

---

## UI Variants

### Full-Featured Search (Default)

```tsx
<DistrictSearch
  districts={districts}
  selectedDistrict={selectedDistrict}
  onSelectDistrict={setSelectedDistrict}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  searchResults={searchResults}
  placeholder="Search districts..."
/>
```

### Compact Search (For Small Spaces)

```tsx
import { CompactDistrictSearch } from '@/components/ui/district-search';

<CompactDistrictSearch
  districts={districts}
  selectedDistrict={selectedDistrict}
  onSelectDistrict={setSelectedDistrict}
/>
```

### Custom Styling

```tsx
<DistrictSearch
  className="w-full lg:w-96"
  // ... other props
/>
```

---

## Styling & Customization

### Highlight Matching Text

The search component automatically highlights matching text:

```tsx
// Internal implementation
const highlightMatch = (text: string, query: string) => {
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark className="bg-yellow-200 font-semibold">{part}</mark>
    ) : part
  );
};
```

### Custom Result Item

Modify the result rendering in `district-search.tsx`:

```tsx
<div className="px-4 py-3 cursor-pointer hover:bg-slate-50">
  {/* Your custom layout */}
  <h4>{district.district}</h4>
  <p>{district.recommended_crops}</p>
</div>
```

---

## Performance Optimization

### 1. Memoization

Already implemented in the hook:

```tsx
const searchResults = useMemo(() => {
  if (!searchQuery.trim()) {
    return districts.slice(0, limit);
  }
  const results = fuse.search(searchQuery);
  return results.slice(0, limit).map(result => result.item);
}, [searchQuery, fuse, districts, limit]);
```

### 2. Lazy Loading

For very large datasets:

```tsx
const displayResults = searchResults.slice(0, 10); // Show first 10

// Load more on scroll
const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  if (bottom) {
    setDisplayLimit(prev => prev + 10);
  }
};
```

### 3. Debouncing

Reduce API calls:

```tsx
const debouncedQuery = useDebounce(searchQuery, 300);

useEffect(() => {
  // Only search after user stops typing for 300ms
  performSearch(debouncedQuery);
}, [debouncedQuery]);
```

---

## Accessibility

### ARIA Labels

```tsx
<Input
  role="combobox"
  aria-expanded={isOpen}
  aria-controls="district-listbox"
  aria-autocomplete="list"
  aria-label="Search districts"
/>

<div
  id="district-listbox"
  role="listbox"
  aria-label="District results"
>
  {results.map((district, i) => (
    <div
      role="option"
      aria-selected={i === focusedIndex}
      tabIndex={-1}
    >
      {district.district}
    </div>
  ))}
</div>
```

### Screen Reader Support

- Announces number of results
- Announces selection changes
- Keyboard navigation hints

---

## Integration with Dashboard

Replace existing district select in Dashboard.tsx:

### Before:
```tsx
<Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select district" />
  </SelectTrigger>
  <SelectContent>
    {districts.sort().map((district) => (
      <SelectItem key={district} value={district}>
        {district}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### After:
```tsx
<DistrictSearch
  districts={districtData}
  selectedDistrict={selectedDistrict}
  onSelectDistrict={setSelectedDistrict}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  searchResults={searchResults}
  placeholder="Search districts..."
  className="w-full lg:w-96"
/>
```

---

## Testing

### Test Cases

```tsx
describe('DistrictSearch', () => {
  it('shows all districts on focus', () => {
    // Test implementation
  });

  it('filters results based on search query', () => {
    // Test fuzzy search
  });

  it('handles keyboard navigation', () => {
    // Test arrow keys, enter, esc
  });

  it('highlights matching text', () => {
    // Test text highlighting
  });

  it('selects district on click', () => {
    // Test selection
  });
});
```

### Manual Testing Checklist

- [ ] All 32 districts appear in dropdown
- [ ] Search works with partial text (e.g., "banga")
- [ ] Search works with typos (e.g., "bengalure")
- [ ] Keyboard navigation works (↑↓ Enter Esc)
- [ ] Selecting a district updates parent component
- [ ] Clear button removes selection
- [ ] Dropdown closes on outside click
- [ ] Mobile responsive
- [ ] Screen reader accessible

---

## Troubleshooting

### Search not working

1. Check if Fuse.js is installed:
```bash
npm list fuse.js
```

2. Verify district data is loaded:
```tsx
console.log('Districts:', districts);
```

3. Check threshold value (lower = stricter):
```tsx
threshold: 0.3 // Try adjusting this
```

### All districts not showing

1. Check limit parameter:
```tsx
useDistrictSearch(districts, {
  limit: 32, // Ensure it's >= number of districts
});
```

2. Verify CSV parsing:
```tsx
const districts = await loadDistrictsFromCSV('/districts.csv');
console.log('Loaded districts:', districts.length); // Should be 32
```

### Performance issues

1. Add debouncing:
```tsx
const debouncedQuery = useDebounce(searchQuery, 300);
```

2. Limit displayed results:
```tsx
const displayResults = searchResults.slice(0, 10);
```

3. Virtualize long lists (for 100+ items):
```bash
npm install react-window
```

---

## Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Fuzzy Search | ✅ | ✅ | ✅ | ✅ |
| Keyboard Nav | ✅ | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ |
| ARIA | ✅ | ✅ | ✅ | ✅ |

---

## Next Steps

1. **Replace** current district select in Dashboard
2. **Test** fuzzy search with various queries
3. **Customize** styling to match your theme
4. **Add** to other pages (Weather, Market Prices, etc.)
5. **Consider** adding district images/icons
6. **Implement** recent searches feature
7. **Add** favorites/bookmarks

---

## Additional Resources

- [Fuse.js Documentation](https://fusejs.io/)
- [Accessibility Guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [React Performance Tips](https://react.dev/learn/render-and-commit)

---

## Example: Complete Integration

See `Dashboard.enhanced-search.tsx` for a full working example with:
- ✅ District search integration
- ✅ Selected district info card
- ✅ Dynamic data loading
- ✅ Smooth animations
- ✅ Error handling
