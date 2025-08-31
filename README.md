Database models:

users:
- id
- first name
- last name
- usernames (e.g. email)
- password
- membership-status

messages:
- id
- title
- timestamp
- content
- userid (references user(id))

