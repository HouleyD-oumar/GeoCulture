import { countriesInfo } from "./data/data.js";
import { formatNumber } from "./libs/numbFormater.js";

// fetch('http://localhost:3000/countries', {
//   method: 'POST',
//   headers: {
//       'Content-Type': 'application/json'
//   },
//   body: JSON.stringify(countriesInfo)
// })
// .then(response => response.json())
// .then(data => {
//   console.log('Inscription réussie ! Vous pouvez maintenant vous connecter.');
//   // window.location.href = 'login.html'; // Redirect to login page
// })
// .catch(error => {
//   console.error('Erreur lors de l\'inscription:', error);
//   console.log('Une erreur s\'est produite. Veuillez réessayer.');
// });

// get all african countries
const Africa =countriesInfo.filter(country =>{
  if(country.region ==='Africa'){
  return country}
} )
// get all european countries
const Europe =countriesInfo.filter(country =>{
  if(country.region ==='Europe'){
  return country}
} )
// get all asian countries
const Asia =countriesInfo.filter(country =>{
  if(country.region==='Asia')return country
})
// get all american countries
const America=countriesInfo.filter(country =>{
  if(country.region==='Americas')return country
})

// get all oceanian countries
const Oceania=countriesInfo.filter(country =>{
  if(country.region==='Oceania')return country
})



// get countries by subregion
let subRegion=[]
countriesInfo.forEach(country =>{
    
     if (!subRegion.includes(country.subregion)) {
       subRegion.push(country.subregion)
     }
});
console.log(subRegion);

// init all subregions 
 
let southernAsia = [],
  northernEurope = [],
  southernEurope = [],
  northernAfrica = [],
  Polynesia = [],
  middleAfrica = [],
  caribbean = [],
  Antarctica = [],
  southAmerica = [],
  westernAsia = [],
  australiandNewZealand = [],
  centralEurope = [],
  easternEurope = [],
  westernEurope = [],
  centralAmerica = [],
  westernAfrica = [],
  northernAmerica = [],
  southernAfrica = [],
  easternAfrica = [],
  southEasternAsia = [],
  easternAsia = [],
  Melanesia = [],
  Micronesia = [],
  centralAsia = [];

// Group countries by subregions
countriesInfo.forEach((country) => {
  switch (country.subregion) {
    case "Southern Asia":
      southernAsia.push(country);
      break;
    case "Northern Europe":
      northernEurope.push(country);
      break;
    case "Southern Europe":
      southernEurope.push(country);
      break;
    case "Northern Africa":
      northernAfrica.push(country);
      break;
    case "Polynesia":
      Polynesia.push(country);
      break;
    case "Middle Africa":
      middleAfrica.push(country);
      break;
    case "Caribbean":
      caribbean.push(country);
      break;
    case "Antarctica":
      Antarctica.push(country);
      break;
    case "South America":
      southAmerica.push(country);
      break;
    case "Western Asia":
      westernAsia.push(country);
      break;
    case "Australia and New Zealand":
      australiandNewZealand.push(country);
      break;
    case "Central Europe":
      centralEurope.push(country);
      break;
    case "Eastern Europe":
      easternEurope.push(country);
      break;
    case "Western Europe":
      westernEurope.push(country);
      break;
    case "Central America":
      centralAmerica.push(country);
      break;
    case "Western Africa":
      westernAfrica.push(country);
      break;
    case "Northern America":
      northernAmerica.push(country);
      break;
    case "Southern Africa":
      southernAfrica.push(country);
      break;
    case "Eastern Africa":
      easternAfrica.push(country);
      break;
    case "South-Eastern Asia":
      southEasternAsia.push(country);
      break;
    case "Eastern Asia":
      easternAsia.push(country);
      break;
    case "Melanesia":
      Melanesia.push(country);
      break;
    case "Micronesia":
      Micronesia.push(country);
      break;
    case "Central Asia":
      centralAsia.push(country);
      break;
    default:
      break;
  }
});

          

    

const continentsField = document.querySelector("ul.row");



function createField(continents) {
  continents.forEach((country) => {
    let countryInfo = document.createElement("li");
    countryInfo.innerHTML = `   
        <li class="col s12 m6 l4">
          <div class="card" id=${country.alpha2Code}>
            <div class="card-image z-depth-2 ">
              <img src="/images/contries/flags/${country.alpha2Code}.svg" alt="" class="responsive-img">
               <a href="single-country.html?code=${country.alpha2Code}" class="btn-floating primary halfway-fab pulse view-details SingleCountryL" data-code=${country.alpha2Code}>
              <i class="material-icons">read_more</i>
          </a>
            </div>
           
            <div class="card-content">
              <h1 class="card-title black-text">${country.translations.fr}</h1>
              
              <ul>
                <li class="transparent"><strong>Capital</strong>: ${country.capital}</li>
                <li class="collection-item transparent"><strong>Population</strong>: ${formatNumber(country.population)}</li>
                <li class="collection-item transparent"><strong>Code Téléphone </strong>: &plus; ${country.callingCodes}</li>
                <li class="collection-item transparent"><strong>Monnaie</strong>: ${country.currencies ? country.currencies.map(curr => `<span class="symbol-money">${curr.symbol}</span> ${curr.name} (${curr.code}) `).join(', ') : 'N/VA'}</li>
                <li class="collection-item transparent"><strong>Abr</strong>: ${country.alpha2Code } , ${country.alpha3Code}</li>
                
              </ul>
            </div>
          
        
          </div>
        </li>`;
    continentsField.appendChild(countryInfo);
     getSingleCountry()
    
  });
}
   function getSingleCountry() {
    
  // Ajouter un événement pour chaque bouton de "Voir les détails"
  document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default anchor behavior
      const countryCode = button.dataset.code;

       // Get the code from data attribute
       console.log(countryCode);
      const selectedCountry = countriesInfo.find(country => country.alpha2Code === countryCode); // Get the selected country using the code
      localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry)); 
      
      // Store in localStorage
      console.log(selectedCountry);
    
      window.location.href = 'single-country.html'; // Redirect to the details page
      // return selectedCountry
    });
  });
}
getSingleCountry()
document.addEventListener('DOMContentLoaded',()=>{

  createField(countriesInfo);
})








// renderSingleCountry(singleCountry)
createField(countriesInfo);
const linkSingle = document.querySelectorAll('.SingleCountryL') ;
let codePays;
let singleCountry
linkSingle
.forEach(link =>{
    //  console.log(link);
  link.addEventListener('click',(e)=>{
   
     codePays= link.dataset.code;
    console.log(codePays);
   
    const selectedCountry = countriesInfo.filter(country => country.alpha2Code === codePays); // Get the selected country using the code
    localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry)); 
    
    // Store in localStorage
    console.log(selectedCountry);
    // window.location.href = 'single-country.html'; 
  })  
})
//
const  searchField =document.getElementById('search')

const selectRegion = document.getElementById('regional-filter')
// filterRegion(selectedRegion)
selectRegion.addEventListener('change',()=>{
  const selectedRegion =selectRegion.value
  console.log(selectedRegion);
  

  filterRegion(selectedRegion)
}
)

// fitler function
function filterRegion(selected) {
  
  if (selected !== 'none' ) {
     continentsField.innerHTML=''
  switch (selected) {
    case 'Africa':

      createField(Africa)
searchField.addEventListener('input',()=>searchCountry(searchField.value,Africa))

      break;
    case 'Europe':
      createField(Europe)
searchField.addEventListener('input',()=>searchCountry(searchField.value,Europe))

      break;
    case 'America':
      createField(America)
searchField.addEventListener('input',()=>searchCountry(searchField.value,America))

      break;
    case 'Asia':
      createField(Asia)
searchField.addEventListener('input',()=>searchCountry(searchField.value,Asia))

      break;
    case 'Oceania':
      createField(Oceania)
searchField.addEventListener('input',()=>searchCountry(searchField.value,Oceania))

      break;
    case 'all':
      createField(countriesInfo)
searchField.addEventListener('input',()=>searchCountry(searchField.value,countriesInfo))

      break;
  
    default:

      break;
  }
  getSingleCountry()
}
  
}
function searchCountry(searchText,searchRegion ) {
  let matches = searchRegion.filter(country=>{
    const regEx = new RegExp(`^${searchText}`,'gi')
      // country.forEach(key => {
         
     return   country.name.match(regEx)|| country.alpha2Code.match(regEx)
     
      
      country.region.match(regEx)||  country.subregion.match(regEx)
           
      // });
  }
  );
  console.log(matches);
  if (matches) {
    continentsField.innerHTML=''
    createField(matches)
    getSingleCountry()

  } else {
    
  }
}
searchField.addEventListener('input',()=>searchCountry(searchField.value,countriesInfo))
