import { usePropertiesStore } from "../../model/store";
import './SearchBar.css'

function SearchBar() {
    const searchTerm = usePropertiesStore((state) => state.searchTerm);
    const setSearchTerm = usePropertiesStore((state) => state.setSearchTerm);
    
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };
    
    return (
        <div className="search-container">
          <div className="search-bar">
            <div className="search-input-container">
              <svg 
                className="search-icon" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path 
                  d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search destinations"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="clear-button"
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M18 6L6 18M6 6l12 12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )
}

export default SearchBar
