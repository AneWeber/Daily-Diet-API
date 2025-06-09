# Diet API
Diet API is a backend application designed to keep track of a diet routine.

<video controls src="DailyDietAPI - use.mp4" title="DailyDietDemo">This was supposed to be a demo video of the API, but unfortunately it's not working.</video>

## Technologies Used
- Node.js
- Typescript
- Fastify
- Knex
- SQLite
- Zod
- Isomnia file available.

## Requirements and Functionalities
- Create a user
- Identify user between transactions using cookies
- Create a meal for a specific user
- A meal must have a title, description, date, and indicate if it is on the diet
- Edit meals
- Delete a meal
- Provide a summary with metrics for each user
- Users can only see and edit meals they have created

## How to try
- npm install
- npm run dev
- Import the Insomnia file into a new Insomnia collection
  - **Create a user:** Update the JSON file with the new user's information.
  - **Create a meal:** Update the JSON file with the new meal details.
  - **List meals:** Retrieve all meals associated with the logged-in user.
  - **Get summary:** View the user's overall metrics.
  - **Get a meal:** Copy the ID of a specific meal from the meals list route, then append it to the end of the "get meal" URL to view its details.
  - **Delete a meal:** Copy the ID of the meal you want to delete from the meals list route, then use it in the "delete meal" endpoint.
  - **Update a meal:** Modify a meal's details by adding its ID to the route and sending an updated JSON payload.

