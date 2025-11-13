# Food Recommendation Feature - Complete Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features Implemented](#features-implemented)
3. [Recent UI Enhancements](#recent-ui-enhancements)
4. [File Structure](#file-structure)
5. [Installation & Setup](#installation--setup)
6. [Usage Guide](#usage-guide)
7. [API Integration](#api-integration)
8. [Customization](#customization)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

A complete food recommendation system for your React Native Expo app featuring:
- **Home Screen Card**: Premium-designed card showing featured food recommendation
- **Meal Plan Screen**: Full daily meal plan organized by meal times
- **API Integration**: Connects to `/account/recommend-foods` endpoint
- **Fallback Data**: Graceful handling with curated sample recommendations

---

## ✨ Features Implemented

### Home Screen Food Recommendation Card
✅ Modern, premium card design with enhanced visuals  
✅ Decorative accent line in brand color  
✅ Layered icon system with dynamic colors  
✅ Category badge with animated dot indicator  
✅ Metadata display (calories & prep time)  
✅ Enhanced CTA button with arrow  
✅ Loading and error state handling  
✅ Press feedback (opacity + scale)  
✅ Seamless navigation to meal plan  

### Meal Plan Screen
✅ Organized by meal times (Breakfast, Lunch, Dinner, Snacks, Desserts)  
✅ Section headers with dividers  
✅ Individual meal cards with icons  
✅ Pull-to-refresh functionality  
✅ Empty state messaging  
✅ Loading states  
✅ Back navigation  
✅ Scrollable content  

### Technical Features
✅ Custom React hook for data fetching  
✅ TypeScript support  
✅ Proper error handling  
✅ Loading states  
✅ Memoized components for performance  
✅ Icon mapping system  
✅ Fallback data support  

---

## 🎨 Recent UI Enhancements

The Food Recommendation Card has been significantly enhanced with premium design features:

### Visual Improvements
- **Enhanced Elevation**: Deeper shadows with better depth perception
- **Accent Line**: 4px brand-colored line at top for visual hierarchy
- **Layered Icon**: Two-ring system (outer decorative + inner icon wrapper)
- **Larger Icons**: Increased from 28px to 32px for better visibility
- **Better Typography**: Enhanced font sizes, spacing, and hierarchy
- **Metadata Pills**: Display calories and prep time with icons
- **Badge Enhancement**: Added dot indicator and border
- **Modern Button**: Enhanced with circular arrow container and shadow
- **Divider**: Subtle line separating content from action
- **Refined Spacing**: Optimized padding throughout

### Interactive Features
- **Press Feedback**: Combined opacity (0.95) and scale (0.985)
- **Smooth Transitions**: Optimized for 60 FPS performance
- **Visual States**: Enhanced loading and error displays

### Design Details
- Increased border radius: 20px → 24px
- Enhanced shadows: Multi-layer depth system
- Better color contrast and hierarchy
- Semantic color coding for icons
- Improved readability with line heights

See `DESIGN_IMPROVEMENTS_SUMMARY.md` for detailed comparison.

---

## 📁 File Structure

```
├── app/
│   └── (root)/
│       ├── (tabs)/
│       │   └── home.tsx                    # Home screen with card
│       ├── meal-plan.tsx                   # Full meal plan screen
│       └── _layout.tsx                     # Navigation config
├── components/
│   ├── FoodRecommendationCard.tsx          # Enhanced home card
│   ├── MealPlanItemCard.tsx                # Individual meal cards
│   └── FOOD_RECOMMENDATION_CARD_IMPROVEMENTS.md
├── hooks/
│   └── useFoodRecommendations.tsx          # Data fetching hook
├── constants/
│   └── foodRecommendations.ts              # Types & fallback data
├── utils/
│   └── mealIcons.ts                        # Icon mapping system
├── DESIGN_IMPROVEMENTS_SUMMARY.md          # UI enhancement docs
└── FOOD_RECOMMENDATION_FEATURE_README.md   # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Expo SDK (already installed)
- React Navigation (already configured)
- @expo/vector-icons (already included)

### No Additional Packages Required!
All functionality uses existing dependencies.

### Setup Steps

1. **Verify all files are present** (see File Structure above)

2. **Check navigation is configured** in `app/(root)/_layout.tsx`:
```typescript
<Stack.Screen name="meal-plan" options={{ headerShown: false }} />
```

3. **Restart your development server**:
```bash
npx expo start
```

4. **Test the feature**:
   - Open your app
   - Navigate to the home screen
   - Scroll to see the food recommendation card
   - Tap the card to view the full meal plan

---

## 📖 Usage Guide

### Home Screen Integration

The card is automatically integrated into the home screen:

```typescript
// In home.tsx
const {
  recommendations: foodRecommendations,
  loading: recommendationsLoading,
  error: recommendationsError,
} = useFoodRecommendations();

const featuredRecommendation = useMemo(
  () => foodRecommendations[0] ?? null,
  [foodRecommendations]
);

// Render the card
<FoodRecommendationCard
  recommendation={featuredRecommendation}
  isLoading={recommendationsLoading}
  error={recommendationsError}
  onPress={() => router.push("/(root)/meal-plan")}
/>
```

### Customizing the Card

```typescript
<FoodRecommendationCard
  recommendation={recommendation}
  isLoading={false}
  error={null}
  onPress={() => {/* custom action */}}
  accentLabel="Chef's Special"          // Custom label
  buttonLabel="View Full Menu"          // Custom button text
/>
```

### Using the Hook Manually

```typescript
import { useFoodRecommendations } from '@/hooks/useFoodRecommendations';

function MyComponent() {
  const { 
    recommendations,    // Array of food items
    loading,           // Boolean loading state
    error,             // Error message or null
    refetch,           // Function to reload data
    hasData            // Boolean if data exists
  } = useFoodRecommendations({ autoFetch: true });
  
  // Use the data...
}
```

---

## 🔌 API Integration

### Endpoint
```
GET https://your-backend.com/account/recommend-foods
```

### Expected Response Format

The API can return data in two formats:

**Format 1: Array**
```json
[
  {
    "id": "rec-001",
    "name": "Overnight Oats",
    "description": "Creamy chia-infused oats with Greek yogurt",
    "mealTime": "breakfast",
    "category": "Healthy",
    "calories": 320,
    "prepTime": "10 min"
  }
]
```

**Format 2: Object with recommendations**
```json
{
  "recommendations": [
    {
      "id": "rec-001",
      "name": "Overnight Oats",
      "description": "Creamy chia-infused oats",
      "mealTime": "breakfast",
      "category": "Healthy",
      "calories": 320,
      "prepTime": "10 min"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Optional | Unique identifier |
| `name` | string | **Required** | Food name |
| `description` | string | **Required** | Brief description (2-3 lines) |
| `mealTime` | string | **Required** | "breakfast", "lunch", "dinner", "snack", "dessert" |
| `category` | string | Optional | Badge label (e.g., "Healthy", "Popular") |
| `calories` | number | Optional | Calorie count |
| `prepTime` | string | Optional | Prep time text (e.g., "10 min") |

### Authentication
The hook uses `credentials: "include"` for cookie-based auth. Adjust if needed:

```typescript
// In useFoodRecommendations.tsx
const response = await fetch(`${BACKEND_URL}/account/recommend-foods`, {
  credentials: "include",  // Change if using different auth
  // Add headers if needed:
  // headers: { 
  //   'Authorization': `Bearer ${token}` 
  // }
});
```

### Fallback Behavior
- If API fails, shows fallback sample data
- If API returns empty array, shows fallback data
- Error message displayed in card
- User can still navigate to meal plan

---

## 🎨 Customization

### Changing Colors

**Card Accent Color:**
```typescript
// In FoodRecommendationCard.tsx styles
accentLine: {
  backgroundColor: "#30B0C7",  // Change this
}
```

**Badge Colors:**
```typescript
badge: {
  backgroundColor: "rgba(48, 176, 199, 0.1)",  // Background
  borderColor: "rgba(48, 176, 199, 0.2)",      // Border
}
```

**Button Colors:**
```typescript
button: {
  backgroundColor: colors.primary,  // Change to any color
}
```

### Changing Icon Mappings

Edit `utils/mealIcons.ts`:

```typescript
const iconMap: Record<string, IconConfig> = {
  breakfast: {
    name: "sunny-outline",      // Change icon
    color: "#FFB74D",           // Change color
    backgroundColor: "rgba(255, 183, 77, 0.12)",  // Change bg
  },
  // Add custom meal times...
};
```

### Modifying Card Layout

All styling is in `components/FoodRecommendationCard.tsx`:

- **Card padding**: Adjust individual section padding
- **Icon size**: Change in `iconContainer` and `iconWrapper`
- **Typography**: Modify font sizes in `title`, `description`, etc.
- **Spacing**: Adjust `gap` properties throughout

### Fallback Data

Edit `constants/foodRecommendations.ts`:

```typescript
export const fallbackFoodRecommendations: FoodRecommendation[] = [
  {
    id: "custom-1",
    name: "Your Custom Meal",
    description: "Your description here",
    mealTime: "breakfast",
    category: "Featured",
    calories: 400,
    prepTime: "15 min",
  },
  // Add more...
];
```

---

## 🧪 Testing

### Manual Testing Checklist

**Home Screen Card:**
- [ ] Card displays correctly
- [ ] Press feedback works (opacity + scale)
- [ ] Loading state shows spinner
- [ ] Error state shows message
- [ ] Metadata displays when available
- [ ] Badge shows with category
- [ ] Navigation to meal plan works

**Meal Plan Screen:**
- [ ] All sections render (breakfast, lunch, dinner, snacks, desserts)
- [ ] Back button navigates correctly
- [ ] Pull-to-refresh works
- [ ] Empty states show appropriately
- [ ] Food cards display properly
- [ ] Icons match meal times
- [ ] Scrolling is smooth

**API Integration:**
- [ ] Data loads from API successfully
- [ ] Fallback data shows on API failure
- [ ] Loading states work correctly
- [ ] Error messages display properly
- [ ] Refresh functionality works

### Testing Different States

**Test Loading State:**
```typescript
<FoodRecommendationCard
  recommendation={null}
  isLoading={true}
  error={null}
  onPress={() => {}}
/>
```

**Test Error State:**
```typescript
<FoodRecommendationCard
  recommendation={null}
  isLoading={false}
  error="Failed to load recommendations"
  onPress={() => {}}
/>
```

**Test Empty State:**
```typescript
<FoodRecommendationCard
  recommendation={null}
  isLoading={false}
  error={null}
  onPress={() => {}}
/>
```

---

## 🔧 Troubleshooting

### Card Not Showing
1. Check import in `home.tsx`
2. Verify hook is called
3. Check console for errors
4. Ensure network connection

### API Not Called
1. Check `BACKEND_URL` in `AuthContext.tsx`
2. Verify authentication
3. Check network inspector
4. Test endpoint with Postman

### Icons Not Displaying
1. Verify `@expo/vector-icons` is installed
2. Check icon names in `mealIcons.ts`
3. Restart development server
4. Clear Metro cache: `npx expo start -c`

### Navigation Issues
1. Check `meal-plan` screen is registered in `_layout.tsx`
2. Verify router import
3. Check navigation params

### Styling Issues
1. Check all required fonts are loaded
2. Verify colors object in `lib/utils.ts`
3. Clear cache and rebuild
4. Check for conflicting styles

### Performance Issues
1. Verify memo is used on components
2. Check for unnecessary re-renders
3. Use React DevTools profiler
4. Reduce shadow complexity if needed

---

## 📝 Best Practices

### Do's ✅
- Keep descriptions concise (2-3 lines)
- Provide both calories and prepTime when available
- Use meaningful category names
- Test on both iOS and Android
- Handle API errors gracefully
- Provide fallback data

### Don'ts ❌
- Don't add heavy animations
- Don't overload with too many recommendations
- Don't skip error handling
- Don't ignore loading states
- Don't use extremely long food names

---

## 🎓 Additional Resources

### Documentation Files
- `DESIGN_IMPROVEMENTS_SUMMARY.md` - Visual design overview
- `FOOD_RECOMMENDATION_CARD_IMPROVEMENTS.md` - Detailed enhancement docs
- Component source files - Inline comments

### Relevant Icons
- Ionicons reference: https://icons.expo.fyi/
- Used icons: sparkles, flame-outline, time-outline, arrow-forward, etc.

### React Native Resources
- StyleSheet: https://reactnative.dev/docs/stylesheet
- Pressable: https://reactnative.dev/docs/pressable
- Performance: https://reactnative.dev/docs/performance

---

## 🚀 What's Next?

### Potential Enhancements
1. **User Favorites**: Save favorite recommendations
2. **Filtering**: Filter by dietary preferences
3. **Search**: Search within recommendations
4. **Sharing**: Share meals with others
5. **Nutrition Details**: Expand to show full nutrition info
6. **Meal Planning**: Allow users to add to meal plan
7. **Recipe Details**: Link to full recipes
8. **Images**: Add food photos

### A/B Testing Ideas
- Different card colors
- Button text variations
- Icon styles
- Layout arrangements

---

## 📄 License & Credits

Designed and implemented following modern mobile UI/UX best practices.
Built with React Native, Expo, and TypeScript.

---

## 💬 Support

If you encounter issues:
1. Check this README
2. Review component documentation
3. Check console logs
4. Test API endpoints
5. Clear cache and rebuild

---

**Happy Coding! 🎉**

The food recommendation feature is now ready to use with a premium, modern design that will delight your users!

