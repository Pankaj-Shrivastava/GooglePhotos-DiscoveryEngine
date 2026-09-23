# Google Photos Discovery Engine Dashboard

An interactive, AI-driven discovery engine and analytical dashboard built to synthesize user feedback, identify critical pain points, and uncover product opportunities for Google Photos.

## 🎯 Project Overview

The Google Photos Discovery Engine is designed to help Product Managers, Designers, and Engineers make data-driven decisions. By analyzing simulated user verbatims and feedback, this dashboard categorizes and visualizes:
- **Pain Points:** Ranked by severity and frequency.
- **Memory Cues:** How users naturally remember and search for their photos (e.g., by date, subject, or event).
- **Google Actions:** Tracking which issues Google has already addressed versus which remain as open opportunities.

## ✨ Key Features

- **Global Dynamic Filtering:** A sticky, context-aware filter bar allows users to slice the entire dashboard by `Severity` and `Memory Cue`. The filter options are computed dynamically from the dataset, ensuring zero "dead ends".
- **Interactive Visualizations:** Utilizes `recharts` to render responsive scatter plots, severity matrices, and frequency charts that instantly react to active filters.
- **State Management via Context:** Clean separation of concerns using React Context (`DataContext` and `FilterContext`) and custom hooks (`useFilters`) to manage and persist global state (including URL-based filter synchronization).
- **Responsive Layout:** A modern, polished UI built with Tailwind CSS, featuring a collapsible sidebar, fluid typography, and intelligent spacing to ensure a premium experience across desktop and mobile.

## 🛠 Tech Stack

- **Framework:** React 18 (via Vite)
- **Styling:** Tailwind CSS (Vanilla CSS for base tokens/resets)
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **Icons:** Google Material Symbols

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pankaj-Shrivastava/GooglePhotos-DiscoveryEngine.git
   cd GooglePhotos-DiscoveryEngine/dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **View the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 📁 Project Structure

```
dashboard/
├── public/
│   └── data/               # Static JSON data files (pain points, frameworks, etc.)
├── src/
│   ├── components/         # Reusable UI components (Sidebar, FilterBar, PageGuide)
│   ├── context/            # React Context providers (DataContext, FilterContext)
│   ├── hooks/              # Custom React hooks (useFilters)
│   ├── pages/              # Route-level page components (Overview, PainPoints, etc.)
│   ├── index.css           # Global CSS and Tailwind directives
│   ├── App.jsx             # Main application router
│   └── main.jsx            # React entry point
└── package.json
```

## 🧠 Engineering & Design Decisions

- **Data-Driven UI:** The `FilterBar` component dynamically computes its options based on the ingested JSON data. If a specific memory cue or severity level doesn't exist in the data, it won't clutter the UI.
- **Smart Filtering:** Pages that display static, pre-aggregated demographic data (like Segmentation) intentionally hide the global filter bar to prevent misleading data manipulation.
- **URL State Synchronization:** Filter parameters are synced to the URL search params, allowing for easy deep-linking and persistent state when refreshing or navigating between specific analytical views.
- **Performance:** Extensive use of `useMemo` and `useCallback` ensures that filtering large datasets and re-rendering charts remains computationally efficient.

---
*Developed as a product strategy and technical demonstration for Google Photos.*
