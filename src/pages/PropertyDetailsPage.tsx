import { useParams } from 'react-router-dom'
import { usePropertiesStore } from '../features/properties/model/store'
import { useNavigate, Link } from 'react-router-dom'
import './PropertyDetailsPage.css'

function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const properties = usePropertiesStore((state) => state.properties)
  
    const propertyId = parseInt(id || '0', 10)
    const property = properties.find(p => p.id === propertyId)
  
    // Mock data for enhanced Airbnb-like features
    const amenities = [
      { name: 'WiFi', icon: '📶' },
      { name: 'Kitchen', icon: '🍳' },
      { name: 'Washer', icon: '🧺' },
      { name: 'Free parking', icon: '🅿️' },
      { name: 'Air conditioning', icon: '❄️' },
      { name: 'TV', icon: '📺' },
      { name: 'Pool', icon: '🏊‍♂️' },
      { name: 'Hot tub', icon: '🛁' }
    ]
  
    const reviews = [
      {
        id: 1,
        author: 'Sarah',
        date: 'December 2024',
        rating: 5,
        text: 'Amazing place! Perfect location and very clean. The host was super responsive and helpful.'
      },
      {
        id: 2,
        author: 'Michael',
        date: 'November 2024',
        rating: 5,
        text: 'Great stay, exactly as described. Would definitely book again!'
      },
      {
        id: 3,
        author: 'Emma',
        date: 'October 2024',
        rating: 4,
        text: 'Very nice property with excellent amenities. The check-in process was smooth.'
      }
    ]
  
    if (!property) {
      return (
        <div className="property-details-container">
          <div className="property-not-found">
            <h2>Property Not Found</h2>
            <p>The property you're looking for doesn't exist or hasn't been loaded yet.</p>
            <Link to="/" className="back-home-link">
              ← Back to Properties
            </Link>
          </div>
        </div>
      )
    }
  
    const handleBackClick = () => {
      navigate(-1)
    }
  
    return (
      <div className="airbnb-details-page">
        {/* Airbnb-style Navigation Header */}
        <header className="airbnb-header">
          <div className="header-left">
            <button onClick={handleBackClick} className="airbnb-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M19 12H5M5 12L12 19M5 12L12 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          
          <div className="header-right">
            <button className="airbnb-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Share
            </button>
            
            <button className="airbnb-action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Save
            </button>
          </div>
        </header>
  
        {/* Image Gallery Section */}
        <section className="airbnb-gallery">
          <div className="gallery-container">
            <div className="main-image">
              <img src={property.image} alt={property.title} />
            </div>
            <div className="gallery-grid">
              <div className="gallery-item">
                <img src={property.image} alt="Property view 2" />
              </div>
              <div className="gallery-item">
                <img src={property.image} alt="Property view 3" />
              </div>
              <div className="gallery-item">
                <img src={property.image} alt="Property view 4" />
              </div>
              <div className="gallery-item">
                <img src={property.image} alt="Property view 5" />
                <div className="show-more-overlay">
                  <button className="show-more-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Show all photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Main Content */}
        <div className="airbnb-content">
          <div className="content-main">
            {/* Property Title and Info */}
            <section className="property-header-section">
              <div className="property-title-row">
                <div className="title-info">
                  <h1 className="airbnb-title">{property.title}</h1>
                  <div className="property-meta">
                    <span className="rating">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {property.rating}
                    </span>
                    <span className="separator">·</span>
                    <span className="reviews-count">{Math.floor(Math.random() * 200) + 50} reviews</span>
                    <span className="separator">·</span>
                    <span className="location">{property.location}</span>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Host Info */}
            <section className="host-section">
              <div className="host-info">
                <div className="host-avatar">
                  <div className="avatar-circle">
                    {property.host.charAt(0).toUpperCase()}
                  </div>
                  <div className="host-details">
                    <h3>Hosted by {property.host}</h3>
                    <p>Superhost · {Math.floor(Math.random() * 5) + 2} years hosting</p>
                  </div>
                </div>
              </div>
  
              <div className="property-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Self check-in</h4>
                    <p>Check yourself in with the keypad.</p>
                  </div>
                </div>
  
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Great location</h4>
                    <p>90% of recent guests gave the location a 5-star rating.</p>
                  </div>
                </div>
  
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Great communication</h4>
                    <p>100% of recent guests rated {property.host} 5-star in communication.</p>
                  </div>
                </div>
              </div>
            </section>
  
            {/* Description */}
            <section className="description-section">
              <p className="airbnb-description">
                Experience the perfect blend of comfort and style in this beautiful {property.type.toLowerCase()}. 
                Located in the heart of {property.location}, this space offers everything you need for an 
                unforgettable stay. Whether you're traveling for business or pleasure, you'll find this 
                property perfectly suited to your needs with modern amenities and thoughtful touches throughout.
              </p>
              <button className="show-more-text">Show more</button>
            </section>
  
            {/* Amenities */}
            <section className="amenities-section">
              <h2>What this place offers</h2>
              <div className="amenities-grid">
                {amenities.slice(0, 6).map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-name">{amenity.name}</span>
                  </div>
                ))}
              </div>
              <button className="show-all-amenities">Show all {amenities.length} amenities</button>
            </section>
  
            {/* Reviews */}
            <section className="reviews-section">
              <h2>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {property.rating} · {reviews.length} reviews
              </h2>
              
              <div className="reviews-grid">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-avatar">
                        {review.author.charAt(0)}
                      </div>
                      <div className="reviewer-info">
                        <h4>{review.author}</h4>
                        <p>{review.date}</p>
                      </div>
                    </div>
                    <div className="review-text">
                      <p>{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="show-all-reviews">Show all {Math.floor(Math.random() * 200) + 50} reviews</button>
            </section>
          </div>
  
          {/* Booking Sidebar */}
          <aside className="booking-sidebar">
            <div className="booking-card-airbnb">
              <div className="booking-header">
                <div className="price-info">
                  <span className="price">${property.price}</span>
                  <span className="price-period">night</span>
                </div>
                <div className="rating-info">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {property.rating} · {Math.floor(Math.random() * 200) + 50} reviews
                </div>
              </div>
  
              <div className="booking-form">
                <div className="date-selector">
                  <div className="date-input">
                    <label>CHECK-IN</label>
                    <input type="date" defaultValue="2024-12-20" />
                  </div>
                  <div className="date-input">
                    <label>CHECKOUT</label>
                    <input type="date" defaultValue="2024-12-25" />
                  </div>
                </div>
                
                <div className="guests-selector">
                  <label>GUESTS</label>
                  <select defaultValue={property.guests > 2 ? 2 : 1}>
                    {Array.from({ length: property.guests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} guest{i !== 0 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
  
                <button className="reserve-btn">Reserve</button>
                
                <p className="no-charge-text">You won't be charged yet</p>
  
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>${property.price} × 5 nights</span>
                    <span>${property.price * 5}</span>
                  </div>
                  <div className="price-row">
                    <span>Cleaning fee</span>
                    <span>$50</span>
                  </div>
                  <div className="price-row">
                    <span>Service fee</span>
                    <span>${Math.floor(property.price * 0.14)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${property.price * 5 + 50 + Math.floor(property.price * 0.14)}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

export default PropertyDetailsPage;