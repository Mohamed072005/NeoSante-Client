# NeoSante-Client - Frontend Application

## Project Overview

`NeoSante-Client` is a modern front-end application built with **Next.js** and **React**. It provides a user-friendly interface for interacting with the `NeoSante-Auth` back-end system. The app features responsive design, smooth animations, and seamless integration with authentication and data management APIs.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [How to Use the Project](#how-to-use-the-project)
- [Packages Used](#packages-used)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Responsive Design**: Built with Tailwind CSS for a mobile-first, responsive layout.
- **Authentication**: Seamless integration with `NeoSante-Auth` for user login, registration, and account management.
- **UI Components**: Pre-built, reusable components using Radix UI and Tailwind CSS.
- **Form Handling**: Robust form validation and management with `react-hook-form` and `zod`.
- **Animations**: Smooth animations powered by `framer-motion`.
- **Theming**: Support for light and dark themes using `next-themes`.

---

## Technologies Used

- **Frontend Framework**: Next.js (v15.0.3)
- **UI Library**: React (v19.0.0-rc)
- **Styling**: Tailwind CSS (v3.4.1) with `tailwind-merge` and `tailwindcss-animate`
- **State Management**: React Hook Form (v7.54.2) with `zod` for validation
- **UI Components**: Radix UI (e.g., `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`)
- **Icons**: Lucide React (v0.469.0)
- **Animations**: Framer Motion (v11.17.0)
- **Testing**: Playwright (v1.50.0) for end-to-end testing

---

## Setup and Installation

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v20.17.0 or later)
- **npm** (v10.x or later)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/neosante-client.git
   cd neosante-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   ```bash
   NEXT_PUBLIC_AUTH_SERVICE_URL= Replace with your back-end API URL
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
## How to Use the Project

Once the app is running, you can:

### 1. **Register a New Account**
- Navigate to the `/register` page.
- Fill out the registration form and submit it.
- Verify your email address using the link sent to your inbox.

### 2. **Log In**
- Go to the `/login` page.
- Enter your credentials (email, username, or phone number) and password.

### 3. **Reset Password**
- Visit the `/forgot-password` page.
- Enter your email address to receive a password reset link.

### 4. **Explore the App**
- Use the navigation menu to access different sections of the app.
- Toggle between light and dark themes using the theme switcher.

## Packages Used

Here’s a list of the primary packages used in this project and their roles:

- **Next.js**: A React framework for server-side rendering, static site generation, and API routes.
- **Tailwind CSS**: A utility-first CSS framework for building responsive and customizable user interfaces.
- **Radix UI**: A set of low-level, unstyled UI components for building accessible and customizable interfaces.
- **React Hook Form**: A library for managing form state and validation.
- **Zod**: A TypeScript-first schema validation library.
- **Framer Motion**: A production-ready motion library for React.
- **Lucide React**: A set of beautiful, customizable icons.
- **Playwright**: A testing framework for end-to-end testing of web applications.

### Contributing

We welcome contributions to improve this project! To contribute, follow the steps below:

#### 1. Fork the Repository
- Click the "Fork" button at the top right of this repository page.
- This will create a copy of the repository under your GitHub account.

#### 2. Clone Your Fork
- Clone the forked repository to your local machine.

   ```bash
   git clone https://github.com/Mohamed072005/NeoSante-Client.git
   ```

#### 3. Create a New Branch
-Create a new branch for your feature or bugfix.

   ```bach
   git checkout -b your-branch-name
   ```

#### 4. Make Changes
- Implement your feature, fix a bug, or make any improvements. Make sure to follow the coding style and best practices used in the project.

#### 5.Commit and Push Your Changes
- Commit your changes with a descriptive message.

   ```bach
   git add .
   git commit -m "Description of changes"
   git push origin your-branch-name
   ```

#### 6. Submit a Pull Request
- Go to the original repository and click the "Pull Request" button.
- Make sure to provide a clear description of your changes in the pull request, referencing any issues or feature requests you're addressing.