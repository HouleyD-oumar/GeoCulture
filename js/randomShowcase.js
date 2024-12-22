import { countriesInfo } from "./data/data.js"
import { formatNumber } from "./libs/numbFormater.js"

const  showcase=document.querySelector('.showcase')
const  contryInfo=document.querySelector('.contryInfo')
const h1=document.createElement('h1')
const ul=document.createElement('ul')
// const li=document.createElement('li')
const strong=document.createElement('strong')
    //  change the contry to show
    function changeContry() {
        clearField(contryInfo)
        const randomContry=countriesInfo[Math.floor(Math.random() * countriesInfo.length)]
        // showcase.style.backgroundImage = `url(./images/contries/flags/${randomContry.alpha2Code}.svg)`
        let pattern=/.+\.jpg/gi
        let matchesUrls= Array.from(`url(./images/showcase/${pattern.test('globe-around.jpg')})`)
        console.log(matchesUrls); 
        showcase.style.backgroundImage = `url(./images/showcase/worldbg.webp)`
        h1.textContent=randomContry.translations.fr
        clearField(ul)

   
        ul.innerHTML=`
          <li class="collection-item transparent"><strong>Capital</strong>: ${randomContry.capital}</li>
                <li class="collection-item transparent"><strong>Population</strong>: ${formatNumber(randomContry.population)} </li>
                <li class="collection-item transparent"><strong>code</strong>: &plus;${randomContry.callingCodes}</li>
                <li class="collection-item transparent"><strong>Monaie</strong>:${randomContry.currencies ? randomContry.currencies[0].name : 'N/VA'}</li>
                <li class="collection-item transparent"><strong>Abr</strong>:${randomContry.alpha3Code}</li>
        `
        contryInfo.appendChild(h1)
        
        ul.classList.add('collection','transparent')
        contryInfo.appendChild(ul)
  
    
        console.log(randomContry);
    }
    window.addEventListener('load',changeContry)
    setInterval(
 //    clearField(contryInfo)
   
    changeContry
   
    
        
   ,30000)
    const intruis = ['oumar','ghj','ghjk'] ;
    console.log(intruis);
    intruis.pop()
    console.log(intruis);
  
   
    
    function clearField(elem) {
     while (elem.firstElementChild) {
         elem.removeChild(elem.firstElementChild)
     }
 }

/* 
fetch ("./js/json/info.json")
.then (res => res.json())
.then(  pays =>{
    console.log(pays)
  


      //  change the contry to show
      function changeContry() {
        clearField(contryInfo)
        const randomContry=pays[Math.floor(Math.random() * pays.length)]
        showcase.style.backgroundImage = `url(./images/contries/${randomContry.bg})`
        h1.textContent=randomContry.name
        clearField(ul)

        for (const key in randomContry) {
         if (key!="bg" && key!="name" && key!='flag') {
                 
             const li=document.createElement('li')
             li.classList.add('collection-item','transparent')
             li.innerHTML= `<strong>${key}</strong>: ${randomContry[key]}`
             strong.textContent=key
            ul.appendChild(li)
           
             }
        }
        contryInfo.appendChild(h1)
        
        ul.classList.add('collection','transparent')
        contryInfo.appendChild(ul)
  
    
    }
      
       window.addEventListener('load',changeContry)
       setInterval(
    //    clearField(contryInfo)
      
       changeContry
      
       
           
      ,30000)
       console.log(pays)   
     
      
       
       function clearField(elem) {
        while (elem.firstElementChild) {
            elem.removeChild(elem.firstElementChild)
        }
    }
   }
  
    
    )
    
  */
 