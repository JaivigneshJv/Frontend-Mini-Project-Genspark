# Simple Banking System Frontend

## Table of Contents

- [Simple Banking System Frontend](#simple-banking-system-frontend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Expected Features](#expected-features)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Directory Structure](#directory-structure)
  - [Relevant Repos](#relevant-repos)

## Overview

The **Simple Banking System Frontend** is a web-based application built to provide the user interface for a simple banking system. This project includes essential banking functionalities such as user management, account management, transaction management, and loan management. The frontend interacts with a [backend](https://github.com/JaivigneshJv/Backend-Mini-Project-Genspark) API to perform various operations.

## Expected Features

- **User Registration and Login**: Users can register and log in to their accounts.
- **User Dashboard**: Users can view their profile, account details, transaction history, and loan status.
- **Account Management**: Users can open new accounts, view account details, and request account closures.
- **Transaction Management**: Users can perform transactions such as deposits, withdrawals, and transfers.
- **Loan Management**: Users can apply for loans, view loan status, and repay loans.
- **Admin Dashboard**: Admin users can manage user accounts, transactions, and loan applications.

## Technologies Used

- **HTML/CSS**: For structuring and styling the web pages.
- **JavaScript**: For implementing client-side logic.
- **SCSS**: For enhanced styling and CSS management.
- **Assets**: Various images and icons used in the UI (some generated using stable diffusion and [iconscout](https://iconscout.com/) ).
- **Axios**: For making HTTP requests to the backend API.

## Project Structure

The project is organized into directories for assets, configuration, styles, scripts, and HTML pages:

- **assets**: Contains images and other static resources.
- **config**: Contains configuration files.
- **css**: Contains compiled CSS files.
- **scss**: Contains SCSS source files for styling.
- **scripts**: Contains JavaScript files for various functionalities.
- **src**: Contains HTML files for different pages and sections of the application.

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed for package management and development.

### Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/Jaivignesh/Frontend-Mini-Project-Genspark.git
   cd Frontend-Mini-Project-Genspark
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

### Running the Application

1. **Start the Development Server**

   ```sh
   npm start
   ```

2. **Open the Application**
   Open your browser and navigate to `http://localhost:3000` to view the application.

## Directory Structure

```
Frontend-Mini-Project-Genspark
├─ .gitignore
├─ assets
│  ├─ banklogo-thin.svg
│  ├─ banklogo.svg
│  ├─ bg-image-bank-stable-diffusion.png
│  ├─ bg.png
│  ├─ home-page-png.png
│  ├─ loan.png
│  ├─ profile.png
│  ├─ Savings.png
│  ├─ Thumbs.db
│  └─ transfers.png
├─ bs-config.json
├─ css
│  ├─ auth.min.css
│  ├─ auth.min.css.map
│  ├─ extras.min.css
│  ├─ extras.min.css.map
│  ├─ home.min.css
│  ├─ home.min.css.map
│  ├─ main.min.css
│  ├─ main.min.css.map
│  ├─ pages.min.css
│  └─ pages.min.css.map
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
│  ├─ admin.js
│  ├─ apply-loan.js
│  ├─ change-email.js
│  ├─ change-password.js
│  ├─ change-txn-password.js
│  ├─ dashboard.js
│  ├─ home.js
│  ├─ loans.js
│  ├─ login.js
│  ├─ new-account.js
│  ├─ pay-loan.js
│  ├─ profile.js
│  ├─ register.js
│  ├─ transact.js
│  └─ transaction.js
├─ scss
│  ├─ auth.scss
│  ├─ extras.scss
│  ├─ home.scss
│  ├─ main.scss
│  └─ pages.scss
└─ src
   ├─ admin
   │  ├─ dashboard.html
   │  └─ home.html
   ├─ auth
   │  ├─ login.html
   │  └─ register.html
   ├─ index.html
   └─ pages
      ├─ apply-loan.html
      ├─ change-email.html
      ├─ change-password.html
      ├─ change-txn-password.html
      ├─ dashboard.html
      ├─ home.html
      ├─ loans.html
      ├─ new-account.html
      ├─ pay-loan.html
      ├─ profile.html
      ├─ transact.html
      └─ transactions.html

```

## Relevant Repos

- [Backend Repository](https://github.com/JaivigneshJv/SimpleBankingSystemAPI)
- [Genspark Training](https://github.com/JaivigneshJv/GenSpark)
