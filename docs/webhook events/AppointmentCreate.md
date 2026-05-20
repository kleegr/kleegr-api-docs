---
tags: [Webhook Events]
---

# AppointmentCreate

Called whenever an appointment is created.

#### Example

```json
{
  "type": "AppointmentCreate",
  "locationId": "0007BWpSzSwfiuSl0tR2",
  "appointment": {
    "id": "0007BWpSzSwfiuSl0tR2",
    "title": "Appointment with dev team",
    "calendarId": "BqTwX8QFwXzpegMve9EQ",
    "contactId": "9NkT25Vor1v4aQatFsv2",
    "appointmentStatus": "confirmed",
    "assignedUserId": "YlWd2wuCAZQzh2cH1fVZ",
    "startTime": "2023-09-25T16:00:00+05:30",
    "endTime": "2023-09-25T17:00:00+05:30"
  }
}
```
