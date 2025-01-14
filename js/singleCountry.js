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
  // Informations générales
    document.getElementById("capital").innerText = country.capital;
    document.getElementById("population").innerText = formatNumber(country.population);
    document.getElementById("region").innerText = country.region;
    document.getElementById("subregion").innerText = country.subregion;
    
    // Données géographiques
    document.getElementById("area").innerText = `${formatNumber(country.area)} km²`;
    document.getElementById("coordinates").innerText = `${country.latlng[0]}°, ${country.latlng[1]}°`;
    document.getElementById("timezones").innerText = country.timezones.join(', ');
    
    // Culture et Langue
    document.getElementById("languages").innerText = country.languages.map(lang => lang.name).join(', ');
    document.getElementById("demonym").innerText = country.demonym;
    
    // Économie et Communication
    document.getElementById("currencies").innerHTML = country.currencies.map(curr => 
        `<span class="symbol-money">${curr.symbol}</span> ${curr.name} (${curr.code})`
    ).join(', ');
    document.getElementById("calling-codes").innerText = `+${country.callingCodes.join(', +')}`;
    
    // Pays frontaliers
    document.getElementById("borders").innerHTML = country.borders ? 
        countryBorders.map(b_country =>
            `<button class="btn-small border waves-effect waves-light">${b_country}</button>`
        ).join(' ') : 'Aucun pays frontalier';
   
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
