CREATE TABLE schedule(
  event_id SERIAL PRIMARY KEY,
  class varchar,
  instructor varchar,
  date varchar,
  time varchar
);

INSERT INTO 
schedule (class, instructor, date, time) 
VALUES ('Hatha', 'Anna', 'September 17', '7:00 - 8:00');

INSERT INTO 
schedule (class, instructor, date, time) 
VALUES ('Vinyasa', 'Ella', 'September 19', '9:00 - 10:00')

ALTER TABLE schedule
ADD participants int

UPDATE schedule
SET participants = 20;

CREATE TABLE bookings(
  booking_id SERIAL PRIMARY KEY,
  guest_first_name varchar,
  guest_last_name varchar,
  guest_email varchar,
  event_id int REFERENCES schedule(event_id),
  );

-- USED IN SERVER
UPDATE schedule
SET participants = (participants - 1)
WHERE event_id = 1;

SELECT schedule.instructor, schedule.date, schedule.class FROM schedule