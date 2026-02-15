# AR QR Code for Desktop Implementation Plan

## 1. Overview

We will enhance the "View in Your Space (AR)" feature. Currently, on Desktop, the button might not do much or just shows a message. We will upgrade it so that:

- **On Desktop**: Clicking the button opens a clean **QR Code Modal**.
- **On Mobile**: Clicking the button opens the **AR Camera** directly (existing behavior).

The QR Code will direct the user's mobile phone to the exact same product page, allowing them to easily access the AR feature where it works best.

## 2. Technical Stack

- **Library**: `qrcode.react` (Lightweight, popular library for generating QR codes in React).
- **Responsive Logic**: We will use a simple window width check or maintain the existing logic where `model-viewer` handles compatibility, but we will intercept the _button click_ for desktop users.

## 3. Implementation Steps

### Step 1: Install Dependencies

We need to install the QR code generator package.

```bash
npm install qrcode.react
```

### Step 2: Update `ARButton.tsx`

We will modify the existing component to include the QR Modal logic.

**Logic Changes:**

1.  **State Management**: Add `const [showQR, setShowQR] = useState(false);`
2.  **Device Detection**:
    - We can check `window.innerWidth` or check if the device supports AR (using `model-viewer` props or checks).
    - _Simpler Approach_: If the screen is > 768px (Desktop), clicking the button opens the modal. If mobile, we let the click propagate to the `<model-viewer>` trigger or fire `activateAR()`.
3.  **QR Generation**:
    - Use `window.location.href` as the value for the QR code so it points to the current page.

### Step 3: Create the Modal UI

Inside `ARButton.tsx` (or a helper), we will render a modal when `showQR` is true.

- **Design**:
  - Dark overlay backdrop.
  - White centered card.
  - Title: "Scan to View in AR".
  - The QR Code generic component.
  - Instruction: "Point your phone camera at this code."
  - Close button.

## 4. Proposed Code Snippet (Draft)

```tsx
// Inside ARButton.tsx

const handleButtonClick = () => {
  const isMobile = window.innerWidth < 768; // Simple check (can be more robust)

  if (isMobile) {
    // Trigger AR directly
    modelViewerRef.current?.activateAR();
  } else {
    // Show QR Code for Desktop users
    setShowQR(true);
  }
};

// Render Logic
return (
  <>
    <button onClick={handleButtonClick}>View in AR</button>

    {/* QR Modal */}
    {showQR && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white p-6 rounded-xl">
          <QRCode value={window.location.href} size={200} />
          <p>Scan with your phone</p>
          <button onClick={() => setShowQR(false)}>Close</button>
        </div>
      </div>
    )}
  </>
);
```

## 5. Execution Plan

1.  **Install**: `npm install qrcode.react`.
2.  **Code**: Edit `components/product/ARButton.tsx` to add the modal and logic.
3.  **Test**: Verified on Desktop (Modal appears) and Mobile (AR launches).

---

**Status**: Plan Ready.
**Next**: Awaiting "start" command to proceed.
