/////////////// SET UP //////////////////

const express = require('express')
const cors = require('cors')
const Sequelize = require('sequelize')
require('dotenv').config()

const CONNECTION_STRING = process.env.CONNECTION_STRING
const PORT = process.env.PORT

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const app = express()
app.use(cors())
app.use(express.json())



//////////// GUEST SIGN UP PAGE ////////////////

//SHOW ALL AVAILABLE CLASSES TO GUESTS
app.get('/getall', (req, res) => {
    sequelize.query(
        `
        SELECT 
        *
        FROM 
        schedule
        ORDER BY date ASC
        `
    ).then((results) => {
        res.status(200).send(results[0])
    })
})

//BOOKING FORM BECOMES A BOOKING
app.post('/booking', (req, res) => {
    const {firstName, lastName, email, eventId} = req.body
    console.log(firstName)

    sequelize.query(
        `
        INSERT INTO 
        bookings 
        (event_id, guest_first_name, guest_last_name, guest_email) 
        VALUES ('${eventId}','${firstName}', '${lastName}', '${email}');

        `
    ).then((results) => {
        res.status(200).send(results[0])
    })

})
//CHANGE PARTICIPANT NUMBER WHEN A BOOKING IS MADE
app.put('/changenumber', (req, res) => {
    const { eventId } = req.body
    sequelize.query(
        `
        UPDATE schedule
        SET participants = (participants - 1)
        WHERE event_id = '${eventId}';

        `
    )
    .then((results) => {
        res.status(200).send(results[0])
    })
})

////////////// EMPLOYEE CLASS MANAGEMENT ////////////////

//SHOW ALL CURRENT CLASSES
app.get('/employeegetall', (req, res) => {
    sequelize.query(
        `
        SELECT 
        *
        FROM 
        schedule
        ORDER BY date ASC
        `
    ).then((results) => {
        res.status(200).send(results[0])
    })
})


//CREATE CLASS
app.post('/classcreate', (req, res) => {
    const { classSelect, instructor, date, time, participant } = req.body
    sequelize.query(
        `
        INSERT INTO
        schedule 
        (class, instructor, date, time, participants)
        VALUES ('${classSelect}', '${instructor}', '${date}', '${time}', '${participant}' )
        `

    ).then((results) => {
        res.status(200).send(results[0])
    })
})


//DELETE CLASS
app.put('/classdelete', (req, res) => {
    const { deleteId } = req.body
    sequelize.query(
        `
        DELETE
        FROM 
        bookings
        WHERE
        event_id = '${deleteId}';

        DELETE
        FROM
        schedule 
        WHERE  
        event_id = '${deleteId}';

        `
    )
    .then((results) => {
        res.status(200).send(results[0])
    })
})

//EDIT CLASS
app.put('/editclass', (req, res) => {
    const { classInput, instructorInput, dateInput, timeInput, participantInput, editId } = req.body
    sequelize.query(
        `
        
        UPDATE schedule
        SET
        class='${classInput}',
        instructor='${instructorInput}',
        date='${dateInput}',
        time='${timeInput}',
        participants='${participantInput}'

        WHERE event_id='${editId}';
        
        `
    )
    .then((results) => {
        res.status(200).send(results[0])
    })
})


/////////////BOOKING PAGE/////////

// GET TABLE FOR GUEST BOOKINGS
app.get('/guestbookings', (req, res) => {
    sequelize.query(
        `
        SELECT bookings.guest_first_name, bookings.guest_last_name, bookings.guest_email, bookings.booking_id,
        schedule.class, schedule.instructor, schedule.date, schedule.time, schedule.event_id
        FROM
        bookings
        JOIN
        schedule
        ON bookings.event_id=schedule.event_id
        ORDER BY schedule.date
        `
    )
    .then((results) => {
        res.status(200).send(results[0])
    })
})

//DELETE A BOOKING
app.put('/bookingdelete', (req, res) => {
    const {deleteBooking, eventId2} = req.body
    sequelize.query(
        `
        DELETE 
        FROM 
        bookings
        WHERE
        booking_id = '${deleteBooking}';

        UPDATE schedule
        SET participants = (participants + 1)
        WHERE event_id = '${eventId2}';
        `
       
    ).then((results) => {
        res.status(200).send(results[0])
    })
})

//EDIT BOOKINGS
app.put('/editbooking', (req, res) => {
    const {firstName, lastName, email, bookingId} = req.body

    sequelize.query(
        `
        UPDATE bookings
        SET
        guest_first_name='${firstName}',
        guest_last_name='${lastName}',
        guest_email='${email}'
        WHERE booking_id='${bookingId}'    
        `
    )
    .then((results) => {
        res.status(200).send(results[0])
    })

})



app.listen(PORT, () => {
    console.log(`up on ${PORT}`)
})