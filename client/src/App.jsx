import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './context/AuthContext.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'
import RequireAuth from './layouts/RequireAuth.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import CapturePage from './pages/CapturePage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import PostcardDetailModal from './components/organisms/PostcardDetailModal.jsx'
import StreaksPage from './pages/StreaksPage.jsx'
import CapsulePage from './pages/CapsulePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/capture" replace />} />
              <Route path="capture" element={<CapturePage />} />
              <Route path="gallery" element={<GalleryPage />}>
                <Route path=":id" element={<PostcardDetailModal />} />
              </Route>
              <Route path="streaks" element={<StreaksPage />}>
                <Route path=":id" element={<PostcardDetailModal />} />
              </Route>
              <Route path="capsule" element={<CapsulePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
