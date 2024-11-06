# to-do-list-api-20dbff
Day 2 of 20 days backend for fun

## Project Overview
The Todo list API project shows the use of authentication to secure some routes. 


## Project Structure
The project has two folders:
* `backend`: Contains the code for the backend api.
* `frontend`: Contains the code for the user-facing webapp.

## Setup
To run the project, kindly clone the repository.
* Open `backend` in a terminal, install dependencies (`npm install`) and start it with `npm run start`.
* Open `frontent` in a terminal, install dependencies (`npm install`) and start it with `npm run dev`.
* The API is live at http://localhost:3000, while the frontend can be accessed at http://localhost:5173.
* The database is in-memory. It is created on project startup.

## Recommendations for update
* The project can be converted to a mono repo to further simplify package management.
* Add persistence to the frontend pinia state so that data can be retained across page reloads.
* Add notification libraries to the frontend.
* Add rich text editing for the blog content.