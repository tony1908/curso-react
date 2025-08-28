import React, { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'

// @ts-ignore
const PropertyGrid = React.lazy(() => import('cards/PropertyGrid'))

const RemotePropertyGrid: React.FC<{ searchTerm?: string }> = ({ searchTerm }) => {
  const navigate = useNavigate()

  const handlePropertyClick = (id: number) => {
    navigate(`/property/${id}`)
  }

  return (
    <Suspense fallback={<div>Loading Property Grid...</div>}>
      <PropertyGrid 
        searchTerm={searchTerm}
        onPropertyClick={handlePropertyClick}
      />
    </Suspense>
  )
}

export default RemotePropertyGrid