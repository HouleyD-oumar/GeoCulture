import { countriesInfo } from '../data/data';

// Get all countries
// Make sure you have this import at the top of the file

export const getAllCountries = async () => {
  try {
    console.log('Loading countries data:', countriesInfo);
    // Return the countries from the imported data
    return Promise.resolve(countriesInfo);
    
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// Get country by ID (alpha3Code or alpha2Code)
export const getCountryById = async (id) => {
  try {
    // Check if id is undefined or empty
    if (!id) {
      throw new Error('Country ID is required');
    }
    
    const countries = await getAllCountries();
    const country = countries.find(c => 
      (c.alpha3Code ).toLocaleLowerCase()=== id.toLocaleLowerCase() || 
      c.alpha2Code.toLocaleLowerCase() === id.toLocaleLowerCase() || 
      c.name.toLocaleLowerCase() === id.toLocaleLowerCase()
    );
    
    if (!country) {
      throw new Error(`Country with ID ${id} not found`);
    }
    
    return country;
  } catch (error) {
    console.error(`Error fetching country with ID ${id}:`, error);
    throw error;
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const countries = await getAllCountries();
    return countries.filter(country => country.region === region);
  } catch (error) {
    console.error(`Error fetching countries in region ${region}:`, error);
    throw error;
  }
};

// Search countries by name
export const searchCountries = async (query) => {
  try {
    const countries = await getAllCountries();
    const searchTerm = query.toLowerCase();
    
    return countries.filter(country => 
      country.name.toLowerCase().includes(searchTerm) ||
      (country.nativeName && country.nativeName.toLowerCase().includes(searchTerm)) ||
      (country.capital && country.capital.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error(`Error searching countries with query ${query}:`, error);
    throw error;
  }
};

// Get all regions
export const getAllRegions = async () => {
  try {
    const countries = await getAllCountries();
    const regions = [...new Set(countries.map(country => country.region))].filter(Boolean);
    return regions.sort();
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};