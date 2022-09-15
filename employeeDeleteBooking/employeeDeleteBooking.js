
/////////// TOGGLES ////////////

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






function getBookings() {
    axios.get('http://localhost:4001/guestbookings')
    .then((results) => {
        console.log(results)
        allInfo = results.data
        for (let i = 0; i< results.data.length; i++) {
            const tableRow = document.createElement('tr')
            tableRow.innerHTML = `
            <td class="data">${allInfo[i].guest_first_name} ${allInfo[i].guest_last_name}</td>
            <td class="data">${allInfo[i].guest_email}</td>
            <td class="data">${allInfo[i].class}</td>
            <td class="data">${allInfo[i].instructor}</td>
            <td class="data">${allInfo[i].date}</td>
            <td class="data">${allInfo[i].time}</td>
            <td class="data">
            <button id="guest-info-edit-${allInfo[i].booking_id}" class="table-buttons" onclick="toggle_two('guest-info-edit-${allInfo[i].booking_id}', 'edit-container-${allInfo[i].booking_id}')">Edit</button>
            <div id="edit-container-${allInfo[i].booking_id}" class="edit-info-contain" style="display:none;">
            <button id="close-edit-${allInfo[i].booking_id}" onclick="toggle_two('guest-info-edit-${allInfo[i].booking_id}', 'edit-container-${allInfo[i].booking_id}')">X</button>
                <form id="edit-info-form-${allInfo[i].booking_id}">
                    <input value='${allInfo[i].guest_first_name}' id="first-name-${allInfo[i].guest_first_name}">
                    <input value='${allInfo[i].guest_last_name}' id="last-name-${allInfo[i].guest_last_name}">
                    <input value='${allInfo[i].guest_email}' id="email-${allInfo[i].guest_email}">
                   
                    <button type="submit" id="submit-edit-${allInfo[i].booking_id}">Submit</button>
                </form>
             </div>
            </td>
           

            <td class="data"><button id="guest-info-delete-${allInfo[i].booking_id}" class="table-buttons" onclick="toggle_two('guest-info-delete-${allInfo[i].booking_id}', 'delete-question-container-${allInfo[i].booking_id}')">Delete</button>
                <div id="delete-question-container-${allInfo[i].booking_id}" style="display:none;">
                <div id="question-text">Are you sure?</div>
                <div id="delete-question-button-container">
                    <button id="yes-button-${allInfo[i].booking_id}" onclick="toggle_visibility('delete-question-container-${allInfo[i].booking_id}'), toggle_visibility('guest-info-edit-${allInfo[i].booking_id}')">YES</button>
                    <button id="no-button-${allInfo[i].booking_id}" onclick="toggle_two('guest-info-delete-${allInfo[i].booking_id}', 'delete-question-container-${allInfo[i].booking_id}')">NO</button>
                </div>
                </div>
            </td>
            `
            // const containEdits = document.getElementById('edit-info-container')
            // containEdits.innerHTML = `
            
            // `
            
    
            const fullTable = document.getElementById('guest-booking-table')
    
            fullTable.appendChild(tableRow)

            const deleteButton = document.getElementById(`yes-button-${allInfo[i].booking_id}`)

            deleteButton.addEventListener('click', () => {
                const deleteBooking = `${allInfo[i].booking_id}`
                const eventId2 = `${allInfo[i].event_id}`
                
                let deleteBookingObj = {
                    deleteBooking: deleteBooking,
                    eventId2: eventId2
                }
                axios.put('http://localhost:4001/bookingdelete', deleteBookingObj)
                .then(() => {
                    console.log('deleted')
                })
                .catch(()=> {
                    console.log('delete issue')
                })

            })

            const form = document.getElementById(`edit-info-form-${allInfo[i].booking_id}`)
        
            form.addEventListener('submit', (e) => {
                e.preventDefault()
                toggle_two(`guest-info-edit-${allInfo[i].booking_id}`, `edit-container-${allInfo[i].booking_id}`)
                
                const first = document.getElementById(`first-name-${allInfo[i].guest_first_name}`)
                const last = document.getElementById(`last-name-${allInfo[i].guest_last_name}`)
                const emailInput = document.getElementById(`email-${allInfo[i].guest_email}`)
                

                let bodyObj = { 
                    firstName: `${first.value}`,
                    lastName: `${last.value}`,
                    email: `${emailInput.value}`,
                    bookingId: `${allInfo[i].booking_id}`
                }
                axios.put('http://localhost:4001/editbooking', bodyObj)
                    .then(()=> {
                        
                    })
                    .catch(err => console.log('form error', err))  
            })
        }
    })
}


getBookings()