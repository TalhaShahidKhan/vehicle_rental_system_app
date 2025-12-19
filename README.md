# RideTheRent - Premium Vehicle Rental System

![RideTheRent Banner](public/logo.png)

**RideTheRent** is a modern, full-stack vehicle rental application designed to provide a seamless and premium booking experience. Built with performance and user experience in mind, it features a sleek, responsive design, real-time vehicle availability, and a secure authentication system.

## Features

- **🚗 Extensive Fleet**: Browse a wide range of vehicles with detailed specifications and high-quality imagery.
- **🔐 Secure Authentication**: Robust user registration and login system with role-based access control.
- **📅 Easy Booking**: Intuitive booking flow with real-time availability checks.
- **📱 Fully Responsive**: Optimized for all devices, from desktops to mobile phones.
- **⚡ High Performance**: Powered by Vite and React for lightning-fast load times and smooth transitions.
- **🎨 Modern UI/UX**: Aesthetic design with smooth animations (Framer Motion) and a polished interface.
- **👤 User Dashboard**: Manage bookings and view profile details.

## Tech Stack

### Frontend

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)

### Backend (API)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd vehicle_rental_project
    ```

2.  **Setup Backend:**

    ```bash
    cd vehicle_rental_system_api
    npm install
    # Create .env file and add necessary variables (PORT, MONGO_URI, JWT_SECRET)
    npm run dev
    ```

3.  **Setup Frontend:**

    ```bash
    cd ../vehicle_rental_system_app
    npm install
    npm run dev
    ```

4.  **Access the Application:**
    Open your browser and navigate to `http://localhost:5173`.

## License

This project is licensed under the MIT License.
