import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingSpinner from '../shared/ui/LoadingSpinner'
import PrivateRoute from '../shared/ui/PrivateRoute'

const HomePage = lazy(() => import('../pages/HomePage'))
const PropertyDetailsPage = lazy(() => import('../pages/PropertyDetailsPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const ChatPage = lazy(() => import('../pages/ChatPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner/>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage/>
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
