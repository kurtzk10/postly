import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { PostcardsProvider } from './context/PostcardsContext.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import CapturePage from './pages/CapturePage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import PostcardDetailModal from './components/organisms/PostcardDetailModal.jsx'
import StreaksPage from './pages/StreaksPage.jsx'
import CapsulePage from './pages/CapsulePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <PostcardsProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/capture" replace />} />
            <Route path="capture" element={<CapturePage />} />
            <Route path="gallery" element={<GalleryPage />}>
              <Route path=":id" element={<PostcardDetailModal />} />
            </Route>
            <Route path="streaks" element={<StreaksPage />} />
            <Route path="capsule" element={<CapsulePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </PostcardsProvider>
    </BrowserRouter>
  )
}
