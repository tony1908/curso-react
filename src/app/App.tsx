import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import PropertyDetailsPage from '../pages/PropertyDetailsPage'
import NotFoundPage from '../pages/NotFoundPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
