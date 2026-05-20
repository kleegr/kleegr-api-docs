---
tags: [Webhook Events]
---

# AppointmentDelete

Called whenever an appointment is deleted.

#### Example

```json
{
  "type": "AppointmentDelete",
  "locationId": "0007BWpSzSwfiuSl0tR2",
  "appointment": {
    "id": "0007BWpSzSwfiuSl0tR2",
    "title": "Appointment with dev team",
    "calendarId": "BqTwX8QFwXzpegMve9EQ",
    "contactId": "9NkT25Vor1v4aQatFsv2",
    "appointmentStatus": "cancelled",
    "startTime": "2023-09-25T16:00:00+05:30",
    "endTime": "2023-09-25T17:00:00+05:30"
  }
}
```
