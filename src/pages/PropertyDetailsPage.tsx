import { useParams } from 'react-router-dom'

function PropertyDetailsPage() {
    const { id } = useParams<{id: string}>()
    return (
        <div>Details: {id}</div>
    )
}

export default PropertyDetailsPage;