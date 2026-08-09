# Notes App — Frontend

React + Vite frontend for the Notes App, connected to a Node.js/Express + MySQL backend.

## Setup

npm install
npm run dev

## Environment Variables

Create a `.env` file in the frontend root:

VITE_API_BASE_URL=http://localhost:3000/api

## Auth Routes

- `/login` — user login
- `/signup` — user signup
- `/dashboard` — protected route, requires authentication