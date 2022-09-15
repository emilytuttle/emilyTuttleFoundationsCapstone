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

/////////// TOGGLE FUNCTIONS ////////////

function toggle_visibility(id) {
    var e = document.getElementById(id);
    e.style.display = ((e.style.display!='none') ? 'none' : 'block');

}

function toggle_visibility2(id2) {

    var f = document.getElementById(id2);
    f.style.display = ((f.style.display!='none') ? 'none' : 'block');
}

function toggle_two(id, id2) {
    toggle_visibility(id)
    toggle_visibility2(id2)
}

//USING TOGGLES


////////// CREATE CLASS //////////

const classForm = document.getElementById('new-class-form')

classForm.addEventListener('submit', (f) => {
    f.preventDefault()

    const classSelect = document.getElementById('class-select')
    const instructorInput = document.getElementById(`instructor-select`)
    const month = document.getElementById(`month-select`)
    const day = document.getElementById(`day-select`)
    const time = document.getElementById('time-select')
    const participant = document.getElementById('participant-select')
    
    
    let bodyObj3 = { 
        classSelect: `${classSelect.value}`,
        instructor: `${instructorInput.value}`,
        date: `${month.value}` + ` ` + `${day.value}`,
        time:  `${time.value}`,
        participant: `${participant.value}`
    }
    
    axios.post('http://localhost:4001/classcreate', bodyObj3)
        .then(()=> {
                classSelect.value = ''
                instructorInput.value = ''
                time.value = ''
                participant.value = ''
                toggle_visibility('class-created-popup')
        })
        .catch(err => console.log('class form error', err))
})

/////////// CLASS VIEW AND DELETE OR EDIT //////////

const cardContainer = document.getElementById('card-container')


function employeeDisplayAll() {
    axios.get('http://localhost:4001/employeegetall')
    .then((results) => {
        classesList = results.data

        

        for (let i=0; i < results.data.length; i++) {
            const classCard = document.createElement('div')
            classCard.classList.add('class-card2')
            classCard.innerHTML = `
            <p class="instructor-text">${classesList[i].class} with ${classesList[i].instructor}</p>
            <div class="time-info">
                <p>${classesList[i].date}</p>
                <p id="time-time">${classesList[i].time}</p>
                <p id="subtract">${classesList[i].participants} spaces left</p>
            </div>
            <button class="book-button2" id="delete-button-${classesList[i].event_id}" onclick="toggle_two('delete-confirmation-container-${classesList[i].event_id}', 'delete-button-${classesList[i].event_id}'), toggle_visibility('edit-button-${classesList[i].event_id}')">Delete Class</button>
            <button class="book-button2" id="edit-button-${classesList[i].event_id}" onclick="toggle_two('edit-container-${classesList[i].event_id}', 'edit-button-${classesList[i].event_id}')">Edit Class</button>

            <div id="delete-confirmation-container-${classesList[i].event_id}" class="delete-popups" style="display:none;">
            
                <div id="delete-question">Are you sure? This action cannot be undone.</div>
                <div id="delete-button-container">
                    <button id="delete-yes-${classesList[i].event_id}" class-"delete-buttons" onclick="toggle_two('delete-confirmation-container-${classesList[i].event_id}', 'delete-finished-container-${classesList[i].event_id}')">YES</button>
                    <button id="delete-no-${classesList[i].event_id}" class-"delete-buttons" onclick="toggle_two('delete-confirmation-container-${classesList[i].event_id}', 'delete-button-${classesList[i].event_id}'), toggle_visibility('edit-button-${classesList[i].event_id}')">NO</button>
                </div>
            </div>

            <div id="delete-finished-container-${classesList[i].event_id}" class="delete-popups" style="display:none;">
                <div id="deleted-comment">Class Deleted. Refresh to view changes</div>
                <button id="delete-ok-${classesList[i].event_id}" class-"delete-buttons" onclick="toggle_visibility('delete-finished-container-${classesList[i].event_id}')">OK</button>
            </div>

            <div id="edit-container-${classesList[i].event_id}" class="delete-popups edit-class-container" style="display:none;">
            <button id="close-edit-${classesList[i].event_id}" onclick="toggle_two('edit-container-${classesList[i].event_id}', 'edit-button-${classesList[i].event_id}')" class="edit-button">X</button>
                <form id="edit-class-${classesList[i].event_id}" class="class-edit-form">
                    <input value="${classesList[i].class}" id="class-${classesList[i].class}" class="class-edit-form-input">
                    <input value="${classesList[i].instructor}" id="instructor-${classesList[i].instructor}" class="class-edit-form-input">
                    <input value="${classesList[i].date}" id="date-${classesList[i].date}" class="class-edit-form-input">
                    <input value="${classesList[i].time}" id="time-${classesList[i].time}" class="class-edit-form-input">
                    <input value="${classesList[i].participants}" id="participants-${classesList[i].participants}" class="class-edit-form-input">
                    <button type="submit" id="submit-class-edit-${classesList[i].event_id}" class="class-edit-form-input button-submit-edit edit-button" >Submit</button>

                </form>

            </div>

            `
            cardContainer.appendChild(classCard)

            const yesButton = document.getElementById(`delete-yes-${classesList[i].event_id}`)

            yesButton.addEventListener('click', () => {


                    const deleteId = `${classesList[i].event_id}`
                
                    let deleteObj = {
                        deleteId: deleteId
                    }
                    axios.put('http://localhost:4001/classdelete', deleteObj)
                    .then(() => {
                        console.log('deleted')
                    })
                    .catch(()=> {
                        console.log('delete issue')
                    })

            })

            let form2 = document.getElementById(`edit-class-${classesList[i].event_id}`)

            form2.addEventListener('submit', (event) => {
                event.preventDefault()
                toggle_two(`edit-container-${classesList[i].event_id}`, `edit-button-${classesList[i].event_id}`)

                const classInput = document.getElementById(`class-${classesList[i].class}`)
                const instructorInput = document.getElementById(`instructor-${classesList[i].instructor}`)
                const dateInput = document.getElementById(`date-${classesList[i].date}`)
                const timeInput = document.getElementById(`time-${classesList[i].time}`)
                const participantInput = document.getElementById(`participants-${classesList[i].participants}`)
                

                let bodyObjEdit = { 
                    classInput: `${classInput.value}`,
                    instructorInput: `${instructorInput.value}`,
                    dateInput: `${dateInput.value}`,
                    timeInput: `${timeInput.value}`,
                    participantInput: `${participantInput.value}`,
                    editId: `${classesList[i].event_id}`
                }
                axios.put('http://localhost:4001/editclass', bodyObjEdit)
                    .then(()=> {
                        
                    })
                    .catch(err => console.log('form error', err))  
            })
        }
    })
    
}

/////////// CALL FUNCTIONS ON LOAD ////////////

employeeDisplayAll()