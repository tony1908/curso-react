import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_PROPERTY } from '../shared/graphql/queries';
import { type AddPropertyVariables, type PropertyInput } from '../shared/graphql/types';
import { type Property } from '../features/properties/model/types';
import './AddPropertyPage.css';

function AddPropertyPage() {
    const navigate = useNavigate();
    const [addProperty, { loading, error }] = useMutation<{ addProperty: Property }, AddPropertyVariables>(ADD_PROPERTY);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<PropertyInput>();

    const onSubmit = async (data: PropertyInput) => {
        try {
            const result = await addProperty({
                variables: { input: data }
            });
            
            if (result.data) {
                console.log('Property added successfully:', result.data.addProperty);
                reset();
                navigate(`/property/${result.data.addProperty.id}`);
            }
        } catch (err) {
            console.error('Error adding property:', err);
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="add-property-page">
            <header className="add-property-header">
                <button onClick={handleBackClick} className="back-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path 
                            d="M19 12H5M5 12L12 19M5 12L12 5" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                    Back
                </button>
                <h1>Add New Property</h1>
            </header>

            <div className="add-property-container">
                <form onSubmit={handleSubmit(onSubmit)} className="add-property-form">
                    <div className="form-section">
                        <h2>Property Details</h2>
                        
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                {...register('title', {
                                    required: 'Property title is required',
                                    minLength: { value: 1, message: 'Title must be at least 1 character' },
                                    maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                                })}
                                className={errors.title ? 'error' : ''}
                            />
                            {errors.title && <span className="error-message">{errors.title.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Property Type</label>
                            <select
                                id="type"
                                {...register('type', { required: 'Property type is required' })}
                                className={errors.type ? 'error' : ''}
                            >
                                <option value="">Select a type</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Villa">Villa</option>
                                <option value="Condo">Condo</option>
                                <option value="Studio">Studio</option>
                            </select>
                            {errors.type && <span className="error-message">{errors.type.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                id="location"
                                type="text"
                                {...register('location', { required: 'Property location is required' })}
                                className={errors.location ? 'error' : ''}
                                placeholder="e.g., New York, NY"
                            />
                            {errors.location && <span className="error-message">{errors.location.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Image URL</label>
                            <input
                                id="image"
                                type="url"
                                {...register('image', {
                                    required: 'Property image URL is required',
                                    minLength: { value: 10, message: 'Image URL must be at least 10 characters' },
                                    maxLength: { value: 500, message: 'Image URL must be less than 500 characters' }
                                })}
                                className={errors.image ? 'error' : ''}
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.image && <span className="error-message">{errors.image.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="details">Details</label>
                            <textarea
                                id="details"
                                rows={4}
                                {...register('details', { required: 'Property details are required' })}
                                className={errors.details ? 'error' : ''}
                                placeholder="Describe the property..."
                            />
                            {errors.details && <span className="error-message">{errors.details.message}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="host">Host Name</label>
                            <input
                                id="host"
                                type="text"
                                {...register('host', { required: 'Host name is required' })}
                                className={errors.host ? 'error' : ''}
                                placeholder="John Doe"
                            />
                            {errors.host && <span className="error-message">{errors.host.message}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price per Night ($)</label>
                                <input
                                    id="price"
                                    type="number"
                                    min="1"
                                    {...register('price', {
                                        required: 'Price is required',
                                        valueAsNumber: true,
                                        min: { value: 1, message: 'Price must be at least $1' }
                                    })}
                                    className={errors.price ? 'error' : ''}
                                />
                                {errors.price && <span className="error-message">{errors.price.message}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="rating">Rating (1-5)</label>
                                <select
                                    id="rating"
                                    {...register('rating', {
                                        required: 'Rating is required',
                                        valueAsNumber: true
                                    })}
                                    className={errors.rating ? 'error' : ''}
                                >
                                    <option value="">Select rating</option>
                                    <option value={1}>1 Star</option>
                                    <option value={2}>2 Stars</option>
                                    <option value={3}>3 Stars</option>
                                    <option value={4}>4 Stars</option>
                                    <option value={5}>5 Stars</option>
                                </select>
                                {errors.rating && <span className="error-message">{errors.rating.message}</span>}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="error-alert">
                            <strong>Error:</strong> {error.message}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="reset-btn"
                            disabled={isSubmitting || loading}
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting || loading}
                        >
                            {(isSubmitting || loading) ? 'Adding Property...' : 'Add Property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPropertyPage;