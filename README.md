# Retinal Diseases Diagnosis System

The Retinal Diseases Diagnosis System is a backend project developed using Node.js (Express), PostgreSQL with Sequelize for the database, and Mailtrap for mailing testing. This system is part of a larger project that integrates AI for diagnosing retinal diseases and managing doctor-patient relationships.

## Table of contents
- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Patients](#patients)
  - [Doctors](#doctors)
  - [Admin](#admin)
- [Contact](#contact)

## Features

- **Authentication:**
  - Login with credentials.
  - Sign up a new user.
  - Change user password.
  - Request a reset token for password reset.
  - Reset user password using the reset token.
  - Refresh authentication token.

- **Patient Management:**
  - Get patient profile information.
  - Update patient profile.
  - Get a list of patient appointments.
  - Get details of a specific appointment.
  - Update details of a specific appointment.
  - Cancel a patient appointment.
  - Make a new appointment.
  - Get available appointments for scheduling.

- **Doctor Management:**
  - Get details of a specific doctor.
  - Get doctor profile information.
  - Update doctor profile.
  - Get a list of doctor appointments.
  - Get details of a specific appointment.
  - Get doctor's schedule.
  - Set doctor's schedule.
  - Upload attachment for a patient.
  - Create a prescription for a patient.

- **Admin Dashboard:**
  - Get all messages.
  - Get details of a specific message.
  - Reply to a message.
  - Get all administrators.
  - Get details of a specific administrator.
  - Add a new administrator.
  - Delete an administrator.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/mo5444237/retinal-diseases-diagnosis-system.git.
   ```

3. Install dependencies:
   ```
   cd retinal-diseases-diagnosis-system
   npm install
   ```

5. Set up environment variables:
   Create a `.env` file and setup the following varibles:
    
     - SERVER_PORT
     - JWT_SECRET_KEY
     - JWT_EXPIRE_TIME
     - JWT_SECRET_REFRESH_KEY
     - JWT_REFRESH_EXPIRE_TIME
     - EMAIL_SENDER
     - EMAIL_HOST
     - EMAIL_PORT
     - EMAIL_USER
     - EMAIL_PASSWORD

4. Set up the database:
   Create a PostgreSQL database.
   Update the database configuration in the `.env` file: 

     - DATABASE_HOST
     - DATABASE_NAME
     - DATABASE_USERNAME
     - DATABASE_PASSWORD
     - DATABASE_PORT
     - DATABASE_CERTIFICATE

5. Start the server:
   ```
   npm start
   ```


## API Endpoints

### Authentication

- **POST /auth/login**
  - Description: Login with credentials.
  
- **POST /auth/signup**
  - Description: Sign up a new user.
  
- **POST /auth/change-password**
  - Description: Change user password.
  
- **POST /auth/reset-token**
  - Description: Request a reset token for password reset.
  
- **PUT /auth/reset-password**
  - Description: Reset user password using the reset token.
  
- **GET /auth/refresh-token**
  - Description: Refresh authentication token.

### Patients

- **GET /patient/profile**
  - Description: Get patient profile information.
  
- **PUT /patient/profile**
  - Description: Update patient profile.
  
- **GET /patient/appointments**
  - Description: Get a list of patient appointments.
  
- **GET /patient/appointments/:appointmentId**
  - Description: Get details of a specific appointment.
  
- **PUT /patient/appointments/:appointmentId**
  - Description: Update details of a specific appointment.
  
- **DELETE /patient/appointments/:appointmentId**
  - Description: Cancel a patient appointment.
  
- **POST /patient/make-appointment**
  - Description: Make a new appointment.
  
- **POST /patient/get-available-appointments**
  - Description: Get available appointments for scheduling.

### Doctors

- **GET /doctor/details/:doctorId**
  - Description: Get details of a specific doctor.
  
- **GET /doctor/profile**
  - Description: Get doctor profile information.
  
- **PUT /doctor/profile**
  - Description: Update doctor profile.
  
- **GET /doctor/appointments**
  - Description: Get a list of doctor appointments.
  
- **GET /doctor/appointments/:appointmentId**
  - Description: Get details of a specific appointment.
  
- **GET /doctor/schedule**
  - Description: Get doctor's schedule.
  
- **POST /doctor/schedule**
  - Description: Set doctor's schedule.
  
- **POST /doctor/upload-attachment**
  - Description: Upload attachment for a patient.
  
- **POST /doctor/prescription**
  - Description: Create a prescription for a patient.

### Admin

- **GET /admin/messages**
  - Description: Get all messages.
  
- **GET /admin/messages/:messageId**
  - Description: Get details of a specific message.
  
- **POST /admin/messages/reply**
  - Description: Reply to a message.
  
- **GET /admin/all**
  - Description: Get all administrators.
  
- **GET /admin/:adminId**
  - Description: Get details of a specific administrator.
  
- **POST /admin/add-admin**
  - Description: Add a new administrator.
  
- **DELETE /admin/delete-admin/:adminId**
  - Description: Delete an administrator.

## Contact

Have questions or feedback? Reach out to us at:

- Email: [mo5444237@gmail.com](mailto:mo5444237@gmail.com)
- GitHub Issues: [Open an Issue](https://github.com/Mo5444237/retinal-diseases-diagnosis-system/issues)
