# Workout Assistant Application



The Workout Assistant Application is a web-based workout diary where you can add your workouts, track your progress, and achieve your fitness goals. This application is built using HTML, CSS, and JavaScript to provide a user-friendly interface and a smooth user experience.
## Functionality

| Functionality           | Status      | Description                                                                 |
|----------------------------|-------------|-----------------------------------------------------------------------------|
| User Registration         |:heavy_check_mark: | Users can register and create an account within the application.                      |
| Login            |     | Users can log in with their registered account.                       |
| Profile Picture Upload    |    | Ability to add a profile picture.                                             |
| Add Workouts     |             | Users can add new workouts, including date, type, and duration.               |
| View Workouts    |        | All workouts are displayed in chronological order for the user.           |
| Delete Workouts    |        | Ability to remove added workouts.                                    |
| Filter Workouts  |      | Workouts can be filtered by date, type, and duration.           |
| Statistics and Analysis      |       | Display summaries and statistics of user workouts.                |
| Customizable Design         |       | Customizable UI design and colors via CSS.                  |
| Notifications          |      | Reminders and notifications for regular training.                   |
| Cloud Data Storage |      | Cloud storage for workout data, allowing multi-device access. |


## Technical Requirements

- Web Browser: Google Chrome, Firefox, Safari, or any modern browser.
- HTML, CSS, JavaScript
- Node.js
- NPM (Node Package Manager)
- Prisma ja SQLite

## Project Structure

``` 
    ├── index.html
    ├── style.css
    ├── script.js
    ├── server.js
    ├── prisma/
    │   ├── schema.prisma  
    └── README.md
    
```

## Installation Guide

1. Clone the project

```
   git clone https://github.com/sanderprii/Trenn
   
   
```
2. Install dependencies
```
npm install express

```
3. Initialize Prisma
```
npx prisma init

```
4. Configure the database in prisma/schema.prisma
   Open prisma/schema.prisma and set up the SQLite database connection and user model:
```
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
}
```
5. Set up the database and generate the Prisma client
```
npx prisma migrate dev --name init
npx prisma generate
```

6. Start the server
```
node server.js
```
## Open the index.html file in your web browser.

## Additional Tools

- Prisma Studio: Use Prisma Studio to view and manage data in your database:
```
npx prisma studio
```