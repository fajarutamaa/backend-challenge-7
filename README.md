[![test](https://github.com/fajarutamaa/backend-challenge-7/actions/workflows/main.yml/badge.svg)](https://github.com/fajarutamaa/backend-challenge-7/actions/workflows/main.yml)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/fajarutamaa/backend-challenge-7/blob/main/.gitignore)

## Installation Guide

Clone the project from GitHub repository:

      git clone https://github.com/fajarutamaa/backend-challenge-7.git

Change Directory:

      cd backend-challenge-7

Install all package dependencies:

      npm install

Compile and hot-reload for development:

      npm start

## Getting Started

this project is running on Railway App `click on the badge` :

[![Railway Badge](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=fff&style=for-the-badge)](https://backend-challenge-7.up.railway.app/)

## Environment Variables Setting

Create an `.env` file in your project root folder and add your variables. See `.env.example` for assistance.

## API Endpoints

| Methods | URLs                   | Actions                  |
| ------- | ---------------------- | ------------------------ |
| POST    | /auth/register         | Register account         |
| POST    | /auth/login            | Login account            |
| POST    | /forgot-password       | Send password reset link |
| POST    | /reset-password/:token | Reset user password      |
| GET     | /users/:username       | View detail profile user |
| PUT     | /users/change-photo    | Change profile photo     |
| DELETE  | /users/:username       | Delete user              |

## Error Handling

This table outlines the status codes, their meanings, and corresponding error messages for the API:

| Status Code | Meaning               | Error Message         |
| ----------- | --------------------- | --------------------- |
| 200         | Success               | Request successful    |
| 400         | Bad Request           | Invalid request       |
| 401         | Unauthorized          | Authentication failed |
| 404         | Not Found             | Data not found        |
| 500         | Internal Server Error | Internal server error |

These status codes and messages are essential for understanding and troubleshooting API responses.

## License

This project is available for use under the MIT License.
