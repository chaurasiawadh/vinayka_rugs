# Vinayka Rugs - Hand-Knotted Heritage

Welcome to the official repository for the **Vinayka Rugs** e-commerce platform. This application is a modern, high-performance web experience designed to showcase and sell exquisite, hand-knotted rugs from Varanasi to the world. It merges the timeless art of rug making with a premium digital user experience.

## 🌟 Overview

Vinayka Rugs is built to tell the story of craftsmanship while providing a seamless shopping experience. The platform features a rich UI with smooth animations, bespoke service requests, and a robust admin dashboard for managing inventory and showcases.

## 🚀 Features

### For Customers

- **Immersive Home Experience**: Dynamic hero sections and curated collections with high-quality imagery.
- **Shop & Discovery**: Advanced filtering and browsing for rugs by category, size, and style.
- **Product Details**: In-depth product views with zoom capabilities and detailed specifications.
- **Bespoke Services**: Dedicated forms for customers to commission custom rug designs.
- **User Accounts**: Secure login/signup via Firebase to manage profiles.
- **Cart & Checkout**: Seamless shopping cart functionality.
- **Store Locator**: Interactive feature to find physical retail locations.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
- **Interactive UI**: Powered by Framer Motion for elegant transitions and micro-interactions.

### For Administrators

- **Admin Dashboard**: Comprehensive control over the platform's content.
- **Product Management**: Add, edit, and delete rug products with image uploads.
- **Gallery Showcase**: Manage the "Curated Collections" and gallery images dynamically.
- **Secure Access**: Protected routes ensuring only authorized personnel can access admin features.

## 🛠️ Tech Stack

This project is built using a modern frontend stack ensuring performance, type safety, and scalability.

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend / DB**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Validation**: [Zod](https://zod.dev/)
- **Linting & Formatting**: ESLint, Prettier

## 🏃‍♂️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/vinayka_rugs.git
    cd vinayka_rugs
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Firebase configuration keys:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📂 Project Structure

```text
vinayka_rugs/
├── app/                      # Next.js App Router (Pages & Layouts)
│   ├── (pages)/
│   │   ├── about/            # About page
│   │   ├── account/          # User account management
│   │   ├── bespoke/          # Custom rug requests
│   │   ├── cart/             # Shopping cart
│   │   ├── contact/          # Contact page
│   │   ├── events/           # Events showcase
│   │   ├── login/            # Authentication
│   │   ├── product/[id]/     # Dynamic product details
│   │   ├── search/           # Search results
│   │   ├── shop/             # Product listing & filters
│   │   ├── store-locator/    # Physical store locations
│   │   ├── trade-program/    # B2B program
│   │   └── watchlist/        # User watchlist
│   ├── admin/                # Admin Dashboard
│   │   ├── login/            # Admin authentication
│   │   └── page.tsx          # Main admin panel
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── providers.tsx         # Context providers wrapper
│
├── components/               # Reusable UI Components
│   ├── admin/                # Admin-specific components
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── GalleryManager.tsx
│   │   └── ProductManager.tsx
│   ├── product/              # Product display components
│   ├── Search/               # Search UI components
│   ├── AppointmentModal.tsx  # Event booking modal
│   ├── BespokeModal.tsx      # Custom request form
│   ├── Button.tsx            # Reusable button
│   ├── CartDrawer.tsx        # Shopping cart sidebar
│   ├── Footer.tsx            # Site footer
│   ├── Header.tsx            # Site header with navigation
│   ├── ImageInput.tsx        # Image upload component
│   ├── LoginModal.tsx        # Authentication modal
│   ├── MegaMenu.tsx          # Navigation mega menu
│   └── ProductCard.tsx       # Product grid item
│
├── context/                  # React Context Providers
│   ├── AuthContext.tsx       # Authentication state
│   └── ShopContext.tsx       # Shopping cart & wishlist
│
├── hooks/                    # Custom React Hooks
│   └── useFirestore.ts       # Firestore data fetching
│
├── lib/                      # Utility Libraries
│   ├── firebase.ts           # Firebase configuration
│   └── product-data.ts       # Product utilities
│
├── utils/                    # Helper Functions
│   └── mockSearch.ts         # Search utilities
│
├── public/                   # Static Assets
│   └── images/               # Image files
│
├── constants.ts              # App constants
├── types.ts                  # TypeScript type definitions
└── tailwind.config.cjs       # Tailwind CSS configuration
```

## 🏗️ Architecture & Flow Diagrams

### System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[Next.js App Router]
        Components[React Components]
        Contexts[Context Providers]
    end

    subgraph "State Management"
        AuthCtx[AuthContext<br/>User Authentication]
        ShopCtx[ShopContext<br/>Cart & Wishlist]
        Hooks[Custom Hooks<br/>useFirestore]
    end

    subgraph "Backend Services"
        Firebase[Firebase]
        Auth[Firebase Auth]
        Firestore[Firestore Database]
        Storage[Firebase Storage]
    end

    subgraph "Data Storage"
        LocalStorage[Browser LocalStorage<br/>Guest Cart]
        RemoteDB[(Firestore Collections)]
    end

    UI --> Components
    Components --> Contexts
    Contexts --> AuthCtx
    Contexts --> ShopCtx
    Components --> Hooks

    AuthCtx --> Auth
    ShopCtx --> Firestore
    ShopCtx --> LocalStorage
    Hooks --> Firestore

    Auth --> Firebase
    Firestore --> Firebase
    Storage --> Firebase

    Firestore --> RemoteDB

    RemoteDB -.->|Real-time Sync| ShopCtx
    RemoteDB -.->|Real-time Sync| AuthCtx

    style UI fill:#e1f5ff
    style Firebase fill:#ffa726
    style RemoteDB fill:#66bb6a
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant AuthContext
    participant Firebase Auth
    participant Firestore

    User->>UI: Click Login/Signup
    UI->>AuthContext: Trigger Authentication
    AuthContext->>Firebase Auth: signInWithEmailAndPassword()
    Firebase Auth-->>AuthContext: User Object

    AuthContext->>Firestore: Listen to user profile
    Firestore-->>AuthContext: UserProfile data

    AuthContext->>AuthContext: Set user state
    AuthContext->>AuthContext: Set userProfile state
    AuthContext-->>UI: Update UI (logged in)

    Note over User,Firestore: Real-time Profile Updates
    Firestore-->>AuthContext: Profile changes
    AuthContext-->>UI: Re-render with new data

    User->>UI: Click Logout
    UI->>AuthContext: logout()
    AuthContext->>Firebase Auth: signOut()
    AuthContext->>AuthContext: Clear user & profile
    AuthContext-->>UI: Update UI (logged out)
```

### Shopping Cart Flow

```mermaid
flowchart TD
    Start([User Adds Product]) --> CheckAuth{User<br/>Logged In?}

    CheckAuth -->|Yes| AddToFirestore[Add to Firestore Cart]
    CheckAuth -->|No| AddToLocal[Add to LocalStorage]

    AddToFirestore --> UpdateState[Update Cart State]
    AddToLocal --> UpdateState

    UpdateState --> OpenDrawer[Open Cart Drawer]
    OpenDrawer --> ShowNotification[Show Success Notification]

    ShowNotification --> UserLogin{User<br/>Logs In?}

    UserLogin -->|Yes| MergeCart[Merge Local + Remote Cart]
    UserLogin -->|No| Continue[Continue Shopping]

    MergeCart --> SyncFirestore[Sync to Firestore]
    SyncFirestore --> ClearLocal[Clear LocalStorage]
    ClearLocal --> RealtimeSync[Real-time Firestore Listener]

    RealtimeSync --> CartUpdates[Cart Auto-updates]
    Continue --> End([End])
    CartUpdates --> End

    style Start fill:#4caf50
    style End fill:#f44336
    style MergeCart fill:#ff9800
    style RealtimeSync fill:#2196f3
```

### Admin Panel Structure

```mermaid
graph LR
    subgraph "Admin Dashboard"
        AdminPage[Admin Page<br/>Route Protection]

        subgraph "Tab Navigation"
            ProductsTab[Products Tab]
            GalleryTab[Gallery Tab]
        end

        subgraph "Product Management"
            ProductManager[ProductManager Component]
            ProductForm[Product Form<br/>Add/Edit]
            ProductList[Product List Table]
            ProductDelete[Delete Confirmation]
        end

        subgraph "Gallery Management"
            GalleryManager[GalleryManager Component]
            GalleryForm[Gallery Form<br/>Add/Edit]
            GalleryGrid[Gallery Grid View]
            GalleryDelete[Delete Confirmation]
        end

        subgraph "Shared Components"
            DeleteModal[DeleteConfirmModal]
            ImageUpload[ImageInput]
        end
    end

    AdminPage --> ProductsTab
    AdminPage --> GalleryTab

    ProductsTab --> ProductManager
    ProductManager --> ProductForm
    ProductManager --> ProductList
    ProductManager --> DeleteModal

    GalleryTab --> GalleryManager
    GalleryManager --> GalleryForm
    GalleryManager --> GalleryGrid
    GalleryManager --> DeleteModal

    ProductForm --> ImageUpload
    GalleryForm --> ImageUpload

    ProductForm -.->|CRUD| Firestore[(Firestore)]
    GalleryForm -.->|CRUD| Firestore
    ImageUpload -.->|Upload| Storage[(Firebase Storage)]

    style AdminPage fill:#9c27b0
    style Firestore fill:#66bb6a
    style Storage fill:#ff9800
```

### Data Flow Architecture

```mermaid
graph TD
    subgraph "User Actions"
        Browse[Browse Products]
        AddCart[Add to Cart]
        Wishlist[Toggle Wishlist]
        Checkout[Checkout]
        BespokeReq[Bespoke Request]
    end

    subgraph "Context Layer"
        ShopContext[ShopContext]
        AuthContext[AuthContext]
    end

    subgraph "Firebase Backend"
        Products[(products)]
        Cart[("users/(uid)/cart")]
        WatchlistDB[("users/(uid)/watchlist")]
        Gallery[(gallery)]
        Users[(users)]
    end

    Browse --> ShopContext
    AddCart --> ShopContext
    Wishlist --> ShopContext
    Checkout --> ShopContext
    BespokeReq --> ShopContext

    ShopContext --> Products
    ShopContext --> Cart
    ShopContext --> WatchlistDB
    ShopContext --> Gallery

    AuthContext --> Users
    AuthContext -.->|Auth State| ShopContext

    Products -.->|Real-time| ShopContext
    Cart -.->|Real-time| ShopContext
    WatchlistDB -.->|Real-time| ShopContext
    Users -.->|Real-time| AuthContext

    style ShopContext fill:#2196f3
    style AuthContext fill:#ff9800
    style Products fill:#4caf50
    style Cart fill:#4caf50
    style WatchlistDB fill:#4caf50
```

### Component Hierarchy

```mermaid
graph TD
    App[App Root] --> Providers[Providers Wrapper]

    Providers --> AuthProvider[AuthProvider]
    Providers --> ShopProvider[ShopProvider]

    ShopProvider --> Layout[Layout Component]

    Layout --> Header[Header]
    Layout --> PageContent[Page Content]
    Layout --> Footer[Footer]
    Layout --> Modals[Global Modals]

    Header --> MegaMenu[MegaMenu]
    Header --> SearchBar[Search Bar]
    Header --> CartIcon[Cart Icon]

    Modals --> CartDrawer[CartDrawer]
    Modals --> BespokeModal[BespokeModal]
    Modals --> LoginModal[LoginModal]
    Modals --> AppointmentModal[AppointmentModal]

    PageContent --> HomePage[Home Page]
    PageContent --> ShopPage[Shop Page]
    PageContent --> ProductPage[Product Detail]
    PageContent --> AdminPage[Admin Panel]

    ShopPage --> ProductCard[ProductCard]
    ShopPage --> Filters[Filter Components]

    ProductPage --> ProductGallery[Product Gallery]
    ProductPage --> ProductInfo[Product Info]
    ProductPage --> ProductSpecs[Specifications]

    AdminPage --> ProductManager[ProductManager]
    AdminPage --> GalleryManager[GalleryManager]

    style App fill:#e1f5ff
    style Providers fill:#fff3e0
    style Layout fill:#f3e5f5
    style AdminPage fill:#9c27b0,color:#fff
```

### User Journey: Guest to Purchase

```mermaid
flowchart TD
    Start([Visit Website]) --> Browse[Browse Products]
    Browse --> ViewProduct[View Product Details]
    ViewProduct --> AddToCart[Add to Cart]

    AddToCart --> GuestCart{Continue as<br/>Guest?}

    GuestCart -->|Yes| LocalCart[Cart in LocalStorage]
    GuestCart -->|No| Login[Login/Signup]

    Login --> MergeData[Merge Guest Cart<br/>with User Account]
    MergeData --> UserCart[Cart in Firestore]

    LocalCart --> ReadyCheckout{Ready to<br/>Checkout?}
    UserCart --> ReadyCheckout

    ReadyCheckout -->|No| ContinueShopping[Continue Shopping]
    ReadyCheckout -->|Yes| CheckoutFlow[Checkout Process]

    ContinueShopping --> Browse

    CheckoutFlow --> ReviewCart[Review Cart]
    ReviewCart --> EnterDetails[Enter Shipping Details]
    EnterDetails --> Payment[Payment]
    Payment --> OrderConfirm[Order Confirmation]

    OrderConfirm --> End([Order Placed])

    style Start fill:#4caf50
    style End fill:#2196f3
    style Login fill:#ff9800
    style MergeData fill:#ff9800
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some amazing feature'`).
5.  Push to the branch (`git push origin feature/amazing-feature`).
6.  Open a Pull Request.

## 📄 License

[MIT License](LICENSE)
