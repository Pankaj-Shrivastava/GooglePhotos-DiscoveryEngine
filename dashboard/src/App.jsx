import { Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { FilterProvider } from './context/FilterContext';
import Layout from './components/Layout';
import OverviewPage from './pages/OverviewPage';
import PainPointsPage from './pages/PainPointsPage';

import FrameworksPage from './pages/FrameworksPage';
import SegmentationPage from './pages/SegmentationPage';
import InterviewGuidePage from './pages/InterviewGuidePage';
export default function App() {
  return (
    <DataProvider>
      <FilterProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<OverviewPage />} />
            <Route path="pain-points" element={<PainPointsPage />} />

            <Route path="frameworks" element={<FrameworksPage />} />
            <Route path="segmentation" element={<SegmentationPage />} />
            <Route path="interview-guide" element={<InterviewGuidePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </FilterProvider>
    </DataProvider>
  );
}
