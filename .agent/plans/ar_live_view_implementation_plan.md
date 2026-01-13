# AR "Live View" Implementation Plan

## 1. Overview
We will implement an Augmented Reality (AR) feature allowing users to view products in their real-world environment using their mobile device's camera. We will use Google's `<model-viewer>` component, which supports both Android (WebXR/SceneViewer) and iOS (AR Quick Look).

## 2. Technical Architecture

### Tech Stack
-   **Framework**: Next.js 14 (App Router)
-   **AR Engine**: `@google/model-viewer` (Web Component)
-   **Backend**: Firebase Firestore & Storage
-   **Formats**: `.glb` (Android/Web), `.usdz` (iOS)

### Data Schema Updates (Firestore)
We need to update the `Product` type definition and Firestore documents to include AR assets and placement logic.

**New Fields in `Product` Interface:**
```typescript
interface Product {
  // ... existing fields
  arAssets?: {
    glbUrl: string;       // URL for Android/WebXR model
    usdzUrl: string;      // URL for iOS AR Quick Look model
    placement: 'floor' | 'wall'; // Orientation hint
    scale?: string;       // Optional scale override (e.g., "1 1 1")
  }
}
```

## 3. Implementation Steps

### Step 1: Install Dependencies
We will install the model-viewer package to ensure type safety and easy import.
```bash
npm install @google/model-viewer
```

### Step 2: Create ARViewer Component
We will create a reusable client component: `components/product/ARButton.tsx`.
*Note: We don't necessarily need to render the 3D model visible or large on the desktop page if the goal is just "Live View". We can have a button that launches the AR mode. However, `<model-viewer>` handles the button internally or we can trigger it.*

**Key Features of Component:**
-   **Lazy Loading**: Only load the heavy 3D engine when needed.
-   **Cross-Platform**: Automatically selects `.usdz` for iOS and `.glb` for Android.
-   **Placement Logic**:
    -   `ar-placement="floor"` for Rugs, Tables.
    -   `ar-placement="wall"` for Curtains, Wall Art.

### Step 3: Integrate into Product Details
We will modify `components/product/ProductDetails.tsx` to include the "Live View" button.

**Logic:**
-   Check if `product.arAssets` exists.
-   If yes, display the "View in your Space" (Live View) button.
-   On Desktop: Show a QR code (optional) or simple "Open on Mobile" textual hint.
-   On Mobile: Clicking the button launches the full-screen camera view.

### Step 4: Storage Organization
We will recommend a folder structure for Firebase Storage:
`/products/3d-models/{productId}/...`

## 4. Proposed Code Structure

### `components/product/ARViewButton.tsx` (Draft)
```tsx
'use client';

import '@google/model-viewer';

// Dynamically import or just use custom elements schemas
// We will need to suppress hydration warnings for custom elements

export default function ARViewButton({ product }) {
  if (!product.arAssets) return null;

  return (
    <div className="mt-4">
      <model-viewer
        src={product.arAssets.glbUrl}
        ios-src={product.arAssets.usdzUrl}
        alt={product.name}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        ar-scale="auto"
        ar-placement={product.arAssets.placement} // 'wall' or 'floor'
        style={{ width: '100%', height: '400px', display: 'none' }} // Hidden, we just want the button?
                                                                    // OR we show a preview. 
                                                                    // For "Button Only", we style the default button or custom slot.
      >
         <button slot="ar-button" className="bg-terracotta text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium hover:bg-terracotta/90 transition-all w-full justify-center">
            <ScanIcon /> View in your space
         </button>
      </model-viewer>
    </div>
  );
}
```

## 5. Mobile & Browser Limitations
-   **iOS**: Requires Safari or Chrome on iOS 12+. Uses AR Quick Look.
-   **Android**: Requires Chrome or Google App. Uses Scene Viewer or WebXR.
-   **Desktop**: No camera pass-through. We usually show a 3D interactive preview instead.

## 6. Execution Plan
1.  **Install** `@google/model-viewer`.
2.  **Define Types**: Update `types.ts`.
3.  **Create Component**: Build `ARViewButton.tsx`.
4.  **Update Detail Page**: Add the button to `ProductDetails.tsx`.
5.  **Mock Data**: Since we don't have real 3D models uploaded yet, we will use sample public URLs (like Google's Astronaut or a Chair) to demonstrate functionality.

---
**Does this plan look good to you? say "ok" to proceed with implementation.**
