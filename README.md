# QT GLOBAL SOFTWARE TASK MANAGER

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [External dependencies](#external-dependencies)
- [Endpoints](#endpoints)
    - [Authentication](#authentication)
    - [Users](#users)
    - [Projects](#projects)
    - [Tasks](#tasks)
- [Authors](#authors)

## Description

This repository contains the API for QT Global Software Task Manager, an intuitive application that allows users to manage tasks, assign team members, attach files, and associate tasks with projects.

## Installation

### Prerequisites

- Node.js. You can download the latest version [here](https://nodejs.org/en/download)
- Postgres database. You can download the latest version [here](https://www.postgresql.org/download/)

### Setup

- To get started, clone the repository to your local machine and navigate into the director.

```bash
git clone https://github.com/nishimweprince/qtglobal-taskmanager-bn.git
cd qtglobal-taskmanager-bn
```
- Install the dependencies using;
``` bash
npm install
```
- Check the `.env.example` file for the required environment variables
- Create a `.env` file and add all the required environment variables
- Run the application using `npm run dev`

### External dependencies

- The application relies on [Google Cloud Storage](https://cloud.google.com/storage) to store the uploaded files. You can create a bucket and add the required environment variables in the `.env` file.

## Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/users/auth/register` | Create a new user |
| POST | `/api/users/auth/login` | Login a user |
| PATCH | `/api/users/password` | Change user password |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get a single user |
| PATCH | `/api/users/` | Update a user. We obtain a user id from their authorization token |

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/projects` | List projects created by the authenticated user |
| GET | `/api/projects/all` | List all projects |
| POST | `/api/projects/` | Create Project |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | List tasks created by the authenticated user |
| GET | `/api/tasks/all` | List all tasks |
| GET | `/api/tasks/:id` | Get single task details |
| POST | `/api/tasks/` | Create Task |

## Authors

- [NISHIMWE Elysee Prince](https://www.linkedin.com/in/nishimweprince/)
