Frontend Link: https://duseca-task-management-app.netlify.app/

📁 Repository Setup
Both the frontend and backend are located in the same repo. Please follow the steps below to set up the project locally.

🖥️ Frontend Setup
The frontend is built with React and deployed via Netlify.

📍Steps to Run Frontend Locally:
1. Navigate to the frontend directory:
    cd duseca-project

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

The frontend will be available at http://localhost:5173 (or another port if specified in your terminal).


⚙️ Backend Setup
.env Variables
PORT=5000
MONGO_URI=set mongodb url here
JWT_SECRET=saadwicks



The backend is built with Node.js and uses Express.

📍Steps to Run Backend Locally:

1. Navigate to the backend directory:
   cd task-management-backend

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

The backend will typically run at http://localhost:5000 unless configured otherwise.

✅ Final Note
Make sure the backend is running locally for the app to function correctly, as the frontend relies on it for all data and authentication.
