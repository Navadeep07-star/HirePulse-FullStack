# Job Portal API

Hi! This is a Spring Boot application that provides a backend for a job portal system. I built this to practice REST API development, security with JWT, and database management.

## Key Features
- Secure Login and Registration using JWT(JSON Web Tokens).
- User roles: JOB_SEEKER, RECRUITER, and ADMIN.
- Job listings with Search and Pagination support.
- Centralized error handling for clean API responses.

## Technologies Used
- Java 21
- Spring Boot 3
- MySQL Database
- Spring Security
- Lombok

## How to Test
1. Clone the project and update the MySQL credentials in application.properties.
2. Run the application from IntelliJ.
3. Use Postman to test the following endpoints:
    - Login: POST /api/auth/login
    - View Jobs (Paginated): GET /api/jobs/allpages?page=0&size=5
    - Search Jobs: GET /api/jobs/search?keyword=Java