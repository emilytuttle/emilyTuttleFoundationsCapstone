const displaySection = document.getElementById('display')

// STICKY NAV BAR
window.onscroll = function() {myFunction()};

var navbar = document.getElementById("subheader");

var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

////////// VISIBILITY TOGGLES /////////////
function toggle_visibility(id, id2) {
    var e = document.getElementById(id);
    e.style.display = ((e.style.display!='none') ? 'none' : 'block');

    var f = document.getElementById(id2);
    f.textContent = ((f.textContent!='Sign Up') ? 'Sign Up' : 'X');
}

// BOOKING FUNCTIONS


function displayAll() {
    axios.get('http://localhost:4001/getall')
    .then((results) => {
        classesList = results.data

        for (let i=0; i < results.data.length; i++) {
            const classCard = document.createElement('div')
            classCard.classList.add('class-card')
            classCard.innerHTML = `
            <p class="instructor-text">${classesList[i].class} with ${classesList[i].instructor}</p>
            <div class="time-info">
                <p id="date-date">${classesList[i].date}</p>
                <p id="time-time">${classesList[i].time}</p>
            </div>
            <div id="sign-up-info">
                <button class="book-button book-button-fix" id="book-button-${classesList[i].event_id}" onclick="toggle_visibility('booking-form-container-${classesList[i].event_id}', 'book-button-${classesList[i].event_id}')">Sign Up</button>
                <p id="subtract">${classesList[i].participants} spaces left</p>
                <div class="form-container" style="display:none;" id="booking-form-container-${classesList[i].event_id}">
                <form class="booking-form" id="booking-form-id">
                    <input id="first-name-${classesList[i].event_id}" placeholder="First Name" class="form-input" required>
                    <input id="last-name-${classesList[i].event_id}" placeholder="Last Name" class="form-input" required>
                    <input type="email" id="email-${classesList[i].event_id}" placeholder="Email" class="form-input" required>
                    <button type="submit" id="submit-form-${classesList[i].event_id}" class="submit-booking-buttons">Submit</button>
                </form>
            <div>
            </div>
            

           
            `
            displaySection.appendChild(classCard)

            
            
            const form = document.getElementById(`booking-form-container-${classesList[i].event_id}`)
            
            form.addEventListener('submit', (e) => {
                e.preventDefault()
                toggle_visibility(`booking-form-container-${classesList[i].event_id}`, `book-button-${classesList[i].event_id}`)
                
                const first = document.getElementById(`first-name-${classesList[i].event_id}`)
                const last = document.getElementById(`last-name-${classesList[i].event_id}`)
                const emailInput = document.getElementById(`email-${classesList[i].event_id}`)
                
                

                let bodyObj = { 
                    firstName: `${first.value}`,
                    lastName: `${last.value}`,
                    email: `${emailInput.value}`,
                    eventId: `${classesList[i].event_id}`
                }
                console.log(bodyObj.firstName)

              
                axios.post('http://localhost:4001/booking', bodyObj)
                    .then(()=> {
        
                            first.value = ''
                            last.value = ''
                            emailInput.value = ''
                            toggle_visibility('booking-created-popup')
                        
                        
                    })
                    .catch(err => console.log('form error', err))


                //PUT NEW NUMBER
                let bodyObj2 = {
                    eventId: `${classesList[i].event_id}`
                }
                axios.put('http://localhost:4001/changenumber', bodyObj2)
                .then(() => {})
            })
         
        }
    })
    .catch()
}

displayAll()