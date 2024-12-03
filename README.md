# Workout Assistant Application

# www.sanderprii.me

The IronTrack Application is a web-based workout diary where you can add your workouts, track your progress, and achieve your fitness goals. This application is built using HTML, CSS, and JavaScript to provide a user-friendly interface and a smooth user experience.
## Functionality

| Functionality           | Status      | Description                                                                 |
|----------------------------|-------------|-----------------------------------------------------------------------------|
| User Registration         |:heavy_check_mark: | Users can register and create an account within the application.                      |
| Login            |  :heavy_check_mark: | Users can log in with their registered account.                       |
| Profile Picture Upload    |    | Ability to add a profile picture.                                             |
| Add Workouts     |     :heavy_check_mark:   | Users can add new workouts, including date, type, and duration.               |
| View Workouts    |    :heavy_check_mark:    | All workouts are displayed in chronological order for the user.           |
| Delete Workouts    | :heavy_check_mark: | Ability to remove added workouts.                                    |
| Filter Workouts  |      | Workouts can be filtered by date, type, and duration.           |
| Statistics and Analysis      |    :heavy_check_mark:   | Display summaries and statistics of user workouts.                |
| Customizable Design         |    :heavy_check_mark:   | Customizable UI design and colors via CSS.                  |
| Notifications          |      | Reminders and notifications for regular training.                   |
| Cloud Data Storage |      | Cloud storage for workout data, allowing multi-device access. |
| Gym Owner Accounts           |            | Gym owners can create accounts to manage their gym's workouts and services. |
| Add Gym Workouts             |                | Gym owners can add workouts/classes to their gym's schedule.                |
| User Registration for Gym Workouts |                | Users can register for gym workouts/classes added by gym owners.            |
| Membership Payments          |                | Users can pay membership fees to gym owners through the platform.           |


## Technical Requirements

- Web Browser: Google Chrome, Firefox, Safari, or any modern browser.
- HTML, CSS, JavaScript
- Node.js
- NPM (Node Package Manager)
- Prisma ja SQLite
- Nodemon

## Installation Guide

1. Clone the project

```
   git clone https://github.com/sanderprii/TA.git
```
2. Install dependencies
```
npm install
```
3. **Create `.env``file** in the root directory and add the following environment variables:
 ```plaintext
    PORT=3000
    SESSION_SECRET=your_secret_key
 ```

4. Set up the database and generate the Prisma client
```
npx prisma generate
```

5. Start the server
```
npm run dev
```
## Open http://localhost:3000 in your browser to view the application.

## Additional Tools

- Prisma Studio: Use Prisma Studio to view and manage data in your database:
```
npx prisma studio
```