# Smart Campus Operations Hub

A full-stack web application built to streamline university operations by combining **resource booking**, **maintenance management**, and **secure user access** into a single platform.

Designed as part of the **IT3030 – Programming Applications and Frameworks** module at SLIIT, this system reflects a real-world, production-style architecture using modern web technologies.

---

## Overview

Universities handle a large number of shared resources and maintenance tasks daily. This system provides a centralized solution where users can:

* Book campus facilities (labs, rooms, equipment)
* Report and track maintenance issues
* Receive real-time updates through notifications
* Access features based on their role (Student, Admin, Technician)

The platform improves efficiency, transparency, and accountability across campus operations.

## Features

* **Resource Booking System**
  Request and manage bookings with approval workflows and conflict prevention

* **Incident & Maintenance Management**
  Report issues, upload evidence, assign technicians, and track progress

* **In-App Notifications**
  Stay updated on booking decisions, ticket status, and comments

* **Secure Authentication**
  Google OAuth 2.0 login with JWT-based session management

* **Role-Based Access Control**
  Different access levels for Users, Admins, and Technicians

## Tech Stack

**Backend**
* Spring Boot (Java)
* Spring Security (JWT + OAuth 2.0)
* Spring Data MongoDB

**Frontend**
* React (Vite)
* Tailwind CSS
* Axios

**Database**
* MongoDB

**Testing**
* Postman

## Getting Started

### Backend

```bash
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Team

* Thewni
* Keerthihan
* Dulaj
* Hashan

## License

This project is for academic purposes under SLIIT (IT3030 module).
