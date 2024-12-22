//sidenav
const sidenav=document.querySelector('.sidenav')
M.Sidenav.init(sidenav,{
    edge:'right'
})
//slider
const slider=document.querySelector('.slider')
M.Slider.init(slider,{
    indicators:false,
    interval:10000,
  
})
// M.AutoInit()

const nav = document.querySelector('nav')
window.addEventListener('scroll', fixNav)

function fixNav() {
    if(window.scrollY > nav.offsetHeight + 150) {
        nav.classList.add('active')
    } else {
        nav.classList.remove('active')
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des dropdowns
    const dropdown = document.querySelectorAll('.dropdown-trigger');
    // const instances =
     M.Dropdown.init(dropdown,{
        hover:false,
        coverTrigger:false,
        constrainWidth:false
     });
     const dropdownContent=document.querySelector('.dropdown-content')
     const select = document.querySelectorAll('select');
      M.FormSelect.init(select);





     function updateDropdownContent() {
        

    // Simuler si l'utilisateur est connecté ou non
    const isLoggedIn = localStorage.getItem('isLoggedIn')=='true'; // Changez ceci pour simuler la connexion
    // let dropdownTarget=dropdown[0].dataset.target

    // if (isLoggedIn) {
    //     document.querySelector('.dropdown-content').innerHTML = `
    //         <li><a href="profile.html"><i class="material-icons">person</i> Profil</a></li>
    //         <li><a href="logout.html"><i class="material-icons">exit_to_app</i> Déconnexion</a></li>
    //     `;
    //     // dropdownTarget='Dropdown1'

    // } else {
    //     document.querySelector('.dropdown-content').innerHTML = `
    //     <li><a href="login.html"><i class="material-icons">login</i> Connexion</a></li>
    //     <li><a href="register.html"><i class="material-icons">person_add</i> Inscription</a></li>
    //     `;
    //     //   dropdownTarget='Dropdown2'
    // }
    dropdownContent.innerHTML = isLoggedIn ? `
    <li><a href="profile.html"><i class="material-icons">person</i> Profil</a></li>
    <li><a href="logout.html" id="logout"><i class="material-icons">exit_to_app</i> Déconnexion</a></li>
` : `
    <li><a href="login.html"><i class="material-icons">login</i> Connexion</a></li>
    <li><a href="register.html"><i class="material-icons">person_add</i> Inscription</a></li>
`;
}
updateDropdownContent()
    document.addEventListener('click', function(event) {
        if (event.target.id === 'logout') {
            localStorage.setItem('isLoggedIn', 'false');
            updateDropdownContent();
        }
    });
});