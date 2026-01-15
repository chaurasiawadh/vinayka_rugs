# Room Visualizer Feature Implementation Plan

## 1. Overview
The **Room Visualizer** is an interactive feature allowing users to upload a photo of their own room and digitally place Vinayka Rugs products onto their floor to see how they look before buying.

## 2. User Flow
1.  **Entry Point**: A "Try in Your Room" button on the Navbar or Home Page.
2.  **Upload Step**: A modal or input opens asking the user to "Upload Room Photo".
3.  **Redirect**: Once the image is selected, the user is redirected to the Visualizer Workspace (`/visualizer`).
4.  **The Workspace**:
    *   **Main View (Center)**: Displays the user's uploaded room image.
    *   **Sidebar (Left)**: Displays a scrollable list of all available rugs.
    *   **Action**: User drags a rug from the sidebar and drops it onto the room image.
5.  **Manipulation (The "Perfect Fit")**:
    *   The rug appears as an overlay on the room image.
    *   **Move**: Drag to positioning.
    *   **Scale**: Resize the rug.
    *   **Perspective/Distortion**: **Critical Feature**. User can drag the *four corners independently* (Corner Pinning) to match the perspective of the floor (e.g., making the rug look like it's lying flat on a receding floor).

## 3. Technical Architecture

### Tech Stack
*   **Framework**: Next.js 14 (App Router)
*   **State Management**: React Context (`VisualizerContext`) to pass the uploaded image from Home to the Visualizer page.
*   **Manipulation Library**: `react-moveable` (Excellent for drag, resize, rotate, and *warp/distort*).
    *   Allows 4-point distortion (matrix3d) which is necessary for aligning a rug with the floor perspective.

### Data Requirements
*   **Rugs List**: Fetch from Firestore (`products` collection).
*   **Rug Images**: We will use the existing product images.
    *   *Note*: For best results, "Top Down" views (flat images) work best. If existing images are angled, it might be harder, but the warp tool will help correct it.

## 4. Implementation Steps

### Phase 1: Setup & Upload Flow
1.  **Create Context**: `context/VisualizerContext.tsx` to store the uploaded room image URL/DataURI temporarily.
2.  **Create Route**: `app/visualizer/page.tsx` for the new workspace.
3.  **Upload Component**: Create a component on the Home Page that accepts a file, saves it to Context, and pushes the router to `/visualizer`.

### Phase 2: The Visualizer Workspace (UI)
1.  **Sidebar**: Create `components/visualizer/ProductSidebar.tsx` to fetch and list rugs.
2.  **Canvas Area**: Create `components/visualizer/RoomCanvas.tsx` to display the room image.

### Phase 3: Interactive Rag Placement (Core Logic)
1.  **Integration of `react-moveable`**:
    *   Implement a "Rug Layer" that sits on top of the room image.
    *   Enable `draggable={true}`, `resizable={true}`.
    *   Enable `warpable={true}` (This is the key for perspective).
2.  **Controls**:
    *   Add buttons to "Flip" or "Rotate 90deg".
    *   Add a "Reset" button.

### Phase 4: Mobile Optimization
*   Ensure the drag-and-drop and touch gestures work smoothly on mobile devices (touch events).

## 5. Proposed File Structure
```
app/
  visualizer/
    page.tsx            // Main Visualizer Application
components/
  visualizer/
    UploadPrompt.tsx    // Initial upload screen (if no image)
    ProductSidebar.tsx  // List of rugs
    RoomCanvas.tsx      // The interactive area
    ActiveRug.tsx       // The rug component wrapped in Moveable
context/
  VisualizerContext.tsx // Stores the room image state
```

## 6. Challenges & Solutions
*   **Perspective**: A simple rotate X/Y isn't enough for realistic floors.
    *   *Solution*: We will use "Warp" (Matrix transformation). This allows the user to drag each of the 4 corners to match the floor's lines exactly.
*   **Image Backgrounds**: If the product images have white backgrounds, they will look bad.
    *   *Solution*: We can set the rug image `mix-blend-mode: multiply` in CSS. This makes the white background transparent-ish (works well for darker rugs) or we rely on PNGs.

---
**Status**: Plan Ready.
**Next**: Awaiting your confirmation to start implementing Phase 1.
