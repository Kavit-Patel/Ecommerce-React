## E-Commerce Website - React TypeScript Project

This project is an e-commerce website built with React and TypeScript. It aims to provide a robust platform for online shopping experiences, featuring a catalog of products, a cart system, user authentication, and more.

## Deployment

This React Website is deployed at - https://ecommerce-react-tau-ten.vercel.app
Backend is deployed at - https://ecom-backend-9pyi.onrender.com

**In This REACT_Front_End("https://ecommerce-react-tau-ten.vercel.app") **

## Features

- A fully responsive design that adapts to various screen sizes for the best shopping experience
- Fetches product data from MongoDB Cloud database
- Displays all available products
- Filter Product based on price and name
- Add product to cart.
- Local Storage as well as mongo db cloud both is used to save cart data parallaly
- Sign up for an account and log in to manage orders and personal information.
- Order Operation (CRUD) in mongo db cloud.
- Payment Operation using Stipe and store everything in mongo db cloud.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Redux Toolkit**: State management library for React.
- **Async Thunk**: For Backend API calling.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **MongoDB cloud**: Backend-as-a-Service (Baas) for database.

## Getting Started

1. Clone this repository.
2. cd/ecomReact.
3. Install dependencies using `npm install`.
4. Create .env file and add env variables
   - VITE_API = https://ecom-backend-9pyi.onrender.com
   - VITE_STRIPE_PUBLISH_KEY = **Your Publish Key for stripe payment gateway**
5. Run the project locally with `npm run dev`.
