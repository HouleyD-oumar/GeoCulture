import { countriesInfo } from "./data/data.js";
import { formatNumber } from "./libs/numbFormater.js";
JSON.parse(window.localStorage.getItem('selectedCountry'))
const selectedCountry = JSON.parse(localStorage.getItem('selectedCountry'));
document.addEventListener('DOMContentLoaded', ()=>{
const country= selectedCountry
console.log(selectedCountry)
console.log(country)

let countryBorders=[],
    borderCode={}
 
const countryInfo = document.getElementById("country-info");
if (country) {
    // Populate country details
    document.getElementById("country-flag").src = `/images/contries/flags/${country.alpha2Code}.svg`; // Use png or svg as needed
    document.getElementById("country-name").innerText = country.translations.fr;
     country.borders && country.borders.forEach(border => {
        countriesInfo.filter(countryB=>{
            if (border===countryB.alpha2Code || border ===countryB.alpha3Code) {
                borderCode={name:countryB.name,code:border}
                border=countryB.translations.fr;
                console.log(borderCode);
                countryBorders.push(border)
            }
            
        })
        console.log(countryBorders);
        `${countryBorders}, `
       console.log( countryBorders.join(', '))
    })
    // Populate additional information
    
    countryInfo.innerHTML = `
        <li><strong>Capital:</strong> ${country.capital}</li>
        <li><strong>Population:</strong> ${formatNumber(country.population)}</li>
        <li><strong>Area:</strong> ${formatNumber(country.area)} km²</li>
        <li><strong>Region:</strong> ${country.region}</li>
        <li><strong>Subregion:</strong> ${country.subregion}</li>
        <li><strong>Demonym:</strong> ${country.demonym}</li>
        <li><strong>Languages:</strong> ${country.languages.map(lang => lang.name).join(', ')}</li>
        <li><strong>Currencies:</strong> ${country.currencies.map(curr => `${curr.name} (${curr.code}) ${curr.symbol}`).join(', ')}</li>
        <li><strong>Calling Codes:</strong> &plus; ${country.callingCodes.join(', ')}</li>
        <li><strong>Timezones:</strong> ${country.timezones.join(', ')}</li>
        <li class="border-countries"><strong>Borders:</strong> ${country.borders 
            ? 
            // countryBorders.join(', ')
            countryBorders.map(b_country=>
                `<button class='border'>${b_country}</button>`
            ).join(' ')
            
            : 'None'}</li>
    `;
   
} else {
    // Handle the case where the country is not found
    countryInfo.innerHTML = `<h1>Pays non trouvé</h1>`;
}
document.getElementById('linkTolearning')
.addEventListener('click',(e)=>{
    localStorage
})
})
 function checkBeforeLeave() {
        // return "êtes-vous sûr de vouloir quitter notre page?"
        localStorage.removeItem('selectedCountry')
    
 }
    // window.onbeforeunload=checkBeforeLeave;
