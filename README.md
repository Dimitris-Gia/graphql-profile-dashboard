# GraphQL Profile Dashboard

A personal profile dashboard built with **Vanilla JavaScript, HTML, CSS, and GraphQL**.

The application connects to the Zone01 platform's GraphQL API and displays personal learning statistics through an interactive dashboard with dynamically generated SVG charts.

## Features

- **Authentication:** Login using a Zone01 username or email and password.
- **JWT Authentication:** Securely authenticate GraphQL requests using a JSON Web Token.
- **Profile Information:** Display username, total XP, audit ratio, and completed projects.
- **XP Progress Chart:** Visualize cumulative XP progression over time.
- **XP by Project Chart:** Display the top 10 projects based on earned XP.
- **Logout:** End the local session and return to the login screen.
- **Responsive Design:** Adapt the dashboard to different screen sizes.

## Technologies

- HTML5
- CSS3
- JavaScript (ES Modules)
- GraphQL
- SVG
- Fetch API
- JWT Authentication

## GraphQL

The application uses the Zone01 GraphQL API:

`https://platform.zone01.gr/api/graphql-engine/v1/graphql`

The project demonstrates three types of GraphQL queries:

- Normal queries
- Nested queries
- Queries with arguments

GraphQL is used to retrieve user information, XP transactions, audit statistics, and completed projects.

## Getting Started

### Prerequisites

- A modern web browser.
- Python 3 installed (for running a local development server).
- A valid Zone01 account.

### Usage using GitHub Url

GitHub URL: https://dimitris-gia.github.io/graphql-profile-dashboard/

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd graphql
   ```

3. Start a local development server:

   ```bash
   python3 -m http.server 8000
   ```

4. Open your browser and visit:

   `http://localhost:8000`

5. Log in using your Zone01 credentials.

## Project Structure

```text
graphql/
├── css/
│   └── styles.css
├── js/
│   ├── auth.js
│   ├── charts.js
│   ├── config.js
│   ├── graphql.js
│   ├── main.js
│   ├── profile.js
├── index.html
└── README.md
```

## Authentication and Security

The application uses Basic Authentication to obtain a JWT from the Zone01 authentication endpoint.

The JWT is stored in `sessionStorage` and included in subsequent GraphQL requests using the Bearer authorization scheme.

Logging out removes the locally stored JWT.

**Note:** This application requires valid Zone01 credentials. Never commit passwords, authentication tokens, or other sensitive credentials to the repository.

## Charts

Both charts are generated dynamically using native SVG elements, without external charting libraries.

1. **XP Progress:** Shows cumulative XP earned over time, grouped by month.
2. **XP by Project:** Shows the ten projects with the highest total XP.

## Live Demo

Coming soon.

## Author

Developed as part of the Zone01 programming curriculum.