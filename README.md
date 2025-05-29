# 📊 GraphQL 

A dynamic user profile page built with data from a GraphQL API. This project fetches personalized school data (Z01 sckool) via GraphQL queries and displays it in a responsive UI — including interactive SVG-based graphs to visualize learning progress, achievements, and activity.
you can visite it here: `https://helouazizi.github.io/graphiql.github.io/`

## 🚀 Objectives

- Learn and practice the GraphQL query language.
- Authenticate users to access personal data.
- Query the GraphQL API endpoint to retrieve user-specific data.
- Create a user profile interface with:
  - **At least three chosen data points** (e.g., XP, grades, skills, audits).
  - **A statistics section** with **at least two SVG graphs**.

## 🌐 GraphQL API

- **Endpoint:** `https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`
- Secure access requires user authentication.

## 🧠 Features

- **Login Page**: Users can log in to access their personal data.
- **User Profile Page**: Displays selected information such as:
  - Basic user info
  - XP earned
  - Audit ratios
  - Grades, projects, and more
- **Statistics Section**: Includes **two or more SVG graphs**:
  - XP over time
  - Projects pass/fail ratio
  - Audit pass rates
  - Attempts per exercise
- **Fully responsive UI** with clean design and accessibility in mind.

## 🖼️ Technologies Used

- **GraphQL** — for querying the backend
- **HTML/CSS/JavaScript** — to build the frontend
- **SVG** — for generating interactive and animated charts
- Optionally:
  - **Fetch API** — to make GraphQL requests
  - **LocalStorage** or **Cookies** — for session persistence

## 📌 Getting Started

1. Clone the repository:
   ``` bash
   git clone https://github.com/helouazizi/graphiql.github.io.git
   cd graphiql.github.io ```

1. Run :
   ``` bash
    python3 -m http.server 3000
   ```
