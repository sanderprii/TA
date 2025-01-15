SET FOREIGN_KEY_CHECKS = 0;

-- User table
DROP TABLE IF EXISTS user;
CREATE TABLE user (
                      id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for unique user',
                      username VARCHAR(191) UNIQUE NOT NULL COMMENT 'Unique username, short dynamic text',
                      password VARCHAR(255) NOT NULL COMMENT 'Password, hashed dynamic text',
                      full_name VARCHAR(191) COMMENT 'Optional full name, flexible length',
                      date_of_birth DATE COMMENT 'Optional birth date, stores only date',
                      sex ENUM('Male', 'Female', 'Other') COMMENT 'Optional gender selection',
                      email VARCHAR(255) UNIQUE COMMENT 'Unique email, flexible length',
                      is_affiliate_owner BOOLEAN COMMENT 'Indicates if user owns an affiliate',
                      monthly_goal SMALLINT COMMENT 'Optional monthly goal as a number',
                      credit FLOAT DEFAULT 0.0 COMMENT 'User credit balance, defaults to 0',
                      home_affiliate SMALLINT COMMENT 'Optional reference to affiliate ID',
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
                      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Auto-updated timestamp'
);



-- insert 5 users into the user table
INSERT INTO user (username, password, full_name) VALUES ('user1', 'password1', 'User One');
INSERT INTO user (username, password, full_name) VALUES ('user2', 'password2', 'User Two');
INSERT INTO user (username, password, full_name) VALUES ('user3', 'password3', 'User Three');
INSERT INTO user (username, password, full_name) VALUES ('user4', 'password4', 'User Four');
INSERT INTO user (username, password, full_name) VALUES ('user5', 'password5', 'User Five');

-- Affiliate table
DROP TABLE IF EXISTS affiliate;
CREATE TABLE affiliate (
                           id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for affiliate',
                           name VARCHAR(100) NOT NULL COMMENT 'Affiliate name, flexible text',
                           address TEXT NOT NULL COMMENT 'Affiliate address, supports long text',
                           training_type VARCHAR(100) NOT NULL COMMENT 'Type of training offered',
                           owner_id INT unsigned NOT NULL COMMENT 'Foreign key for owner (user), cascades on delete for consistency',
                           FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE
);

-- insert 5 affiliates into the affiliate table
INSERT INTO affiliate (name, address, training_type, owner_id) VALUES ('Affiliate 1', 'Address 1', 'CrossFit', 1);
INSERT INTO affiliate (name, address, training_type, owner_id) VALUES ('Affiliate 2', 'Address 2', 'CrossFit', 2);
INSERT INTO affiliate (name, address, training_type, owner_id) VALUES ('Affiliate 3', 'Address 3', 'CrossFit', 3);
INSERT INTO affiliate (name, address, training_type, owner_id) VALUES ('Affiliate 4', 'Address 4', 'CrossFit', 4);
INSERT INTO affiliate (name, address, training_type, owner_id) VALUES ('Affiliate 5', 'Address 5', 'CrossFit', 5);



-- Training table
DROP TABLE IF EXISTS training;
CREATE TABLE training (
                          id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for training',
                          type VARCHAR(50) NOT NULL COMMENT 'Training type, flexible text',
                          wod_name VARCHAR(100) COMMENT 'Optional WOD name, flexible text',
                          wod_type ENUM('For Time', 'EMOM', 'Tabata', 'AMRAP') COMMENT 'Specific training type',
                          date DATE COMMENT 'Optional training date and time',
                          score VARCHAR(50) COMMENT 'Training score, short flexible text',
                          user_id INT unsigned NOT NULL COMMENT 'Foreign key for user, cascades on delete to maintain consistency',
                          FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- insert 5 training records into the training table
INSERT INTO training (type, wod_name, wod_type, score, user_id) VALUES ('CrossFit', 'WOD 1', 'For Time', '10:00', 1);
INSERT INTO training (type, wod_name, wod_type, score, user_id) VALUES ('CrossFit', 'WOD 2', 'EMOM', '20:00', 2);
INSERT INTO training (type, wod_name, wod_type, score, user_id) VALUES ('CrossFit', 'WOD 3', 'Tabata', '8 rounds', 3);
INSERT INTO training (type, wod_name, wod_type, score, user_id) VALUES ('CrossFit', 'WOD 4', 'AMRAP', '5 rounds', 4);
INSERT INTO training (type, wod_name, wod_type, score, user_id) VALUES ('CrossFit', 'WOD 5', 'For Time', '15:00', 5);

-- Exercise table
DROP TABLE IF EXISTS exercise;
CREATE TABLE exercise (
                          id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for exercise',
                          exercise_data TEXT NOT NULL COMMENT 'Exercise details, supports long text',
                          training_id INT unsigned NOT NULL COMMENT 'Foreign key for training, cascades on delete for data integrity',
                          FOREIGN KEY (training_id) REFERENCES training(id) ON DELETE CASCADE
);

-- insert 5 exercise records into the exercise table
INSERT INTO exercise (exercise_data, training_id) VALUES ('Exercise 1 details', 1);
INSERT INTO exercise (exercise_data, training_id) VALUES ('Exercise 2 details', 2);
INSERT INTO exercise (exercise_data, training_id) VALUES ('Exercise 3 details', 3);
INSERT INTO exercise (exercise_data, training_id) VALUES ('Exercise 4 details', 4);
INSERT INTO exercise (exercise_data, training_id) VALUES ('Exercise 5 details', 5);

-- Record table
DROP TABLE IF EXISTS record;
CREATE TABLE record (
                        id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for record',
                        type VARCHAR(50) COMMENT 'Record type, flexible text',
                        name VARCHAR(100) COMMENT 'Record name, flexible text',
                        date DATE COMMENT 'Record date and time',
                        score VARCHAR(50) COMMENT 'Record score, short text',
                        weight FLOAT COMMENT 'Record weight, floating-point number',
                        time TIME COMMENT 'Record time, score in time format',
                        user_id INT unsigned NOT NULL COMMENT 'Foreign key for user, cascades on delete to maintain consistency',
                        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- insert 5 records into the record table
INSERT INTO record (type, name, score, user_id) VALUES ('Workout', 'Record 1', '100', 1);
INSERT INTO record (type, name, score, user_id) VALUES ('Workout', 'Record 2', '200', 2);
INSERT INTO record (type, name, score, user_id) VALUES ('Workout', 'Record 3', '300', 3);
INSERT INTO record (type, name, score, user_id) VALUES ('Workout', 'Record 4', '400', 4);
INSERT INTO record (type, name, score, user_id) VALUES ('Workout', 'Record 5', '500', 5);


-- Default WOD table
DROP TABLE IF EXISTS default_wod;
CREATE TABLE default_wod (
                             id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for WOD',
                             name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique WOD name, flexible text',
                             type VARCHAR(50) NOT NULL COMMENT 'WOD type, flexible text',
                             description TEXT NOT NULL COMMENT 'WOD description, long text'
);

-- Class Schedule table
DROP TABLE IF EXISTS class_schedule;
CREATE TABLE class_schedule (
                                id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for schedule',
                                training_name VARCHAR(100) NOT NULL COMMENT 'Training name, flexible text',
                                time DATETIME NOT NULL COMMENT 'Scheduled date and time',
                                duration SMALLINT NOT NULL COMMENT 'Duration in minutes',
                                trainer VARCHAR(100) COMMENT 'Optional trainer name',
                                member_capacity SMALLINT NOT NULL COMMENT 'Maximum number of attendees',
                                location VARCHAR(100) COMMENT 'Optional location details',
                                repeat_weekly BOOLEAN DEFAULT FALSE COMMENT 'Weekly repetition indicator',
                                owner_id INT unsigned NOT NULL COMMENT 'Foreign key for owner (user), cascades on delete for consistency',
                                affiliate_id INT unsigned NOT NULL COMMENT 'Foreign key for affiliate, cascades on delete for consistency',
                                FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE,
                                FOREIGN KEY (affiliate_id) REFERENCES affiliate(id) ON DELETE CASCADE
);

-- insert 5 class schedules into the class schedule table
INSERT INTO class_schedule (training_name, time, duration, member_capacity, owner_id, affiliate_id) VALUES ('Class 1', '2023-01-01 08:00:00', 60, 10, 1, 1);
INSERT INTO class_schedule (training_name, time, duration, member_capacity, owner_id, affiliate_id) VALUES ('Class 2', '2023-01-02 09:00:00', 60, 15, 2, 2);
INSERT INTO class_schedule (training_name, time, duration, member_capacity, owner_id, affiliate_id) VALUES ('Class 3', '2023-01-03 10:00:00', 60, 20, 3, 3);
INSERT INTO class_schedule (training_name, time, duration, member_capacity, owner_id, affiliate_id) VALUES ('Class 4', '2023-01-04 11:00:00', 60, 25, 4, 4);
INSERT INTO class_schedule (training_name, time, duration, member_capacity, owner_id, affiliate_id) VALUES ('Class 5', '2023-01-05 12:00:00', 60, 30, 5, 5);

-- Plan table
DROP TABLE IF EXISTS plan;
CREATE TABLE plan (
                      id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for plan',
                      name VARCHAR(100) NOT NULL COMMENT 'Plan name, flexible text',
                      validity_days SMALLINT NOT NULL COMMENT 'Plan validity in days',
                      price FLOAT NOT NULL COMMENT 'Plan price, floating-point number',
                      additional_data TEXT COMMENT 'Optional additional details',
                      sessions SMALLINT NOT NULL COMMENT 'Number of sessions included',
                      owner_id INT unsigned NOT NULL COMMENT 'Foreign key for owner (user), cascades on delete for consistency',
                      FOREIGN KEY (owner_id) REFERENCES user(id) ON DELETE CASCADE
);

-- insert 5 plans into the plan table
INSERT INTO plan (name, validity_days, price, sessions, owner_id) VALUES ('Plan 1', 30, 100.00, 10, 1);
INSERT INTO plan (name, validity_days, price, sessions, owner_id) VALUES ('Plan 2', 60, 200.00, 20, 2);
INSERT INTO plan (name, validity_days, price, sessions, owner_id) VALUES ('Plan 3', 90, 300.00, 30, 3);
INSERT INTO plan (name, validity_days, price, sessions, owner_id) VALUES ('Plan 4', 120, 400.00, 40, 4);
INSERT INTO plan (name, validity_days, price, sessions, owner_id) VALUES ('Plan 5', 150, 500.00, 50, 5);

-- User Plan table
DROP TABLE IF EXISTS user_plan;
CREATE TABLE user_plan (
                           id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for user plan',
                           user_id INT unsigned NOT NULL COMMENT 'Foreign key for user, cascades on delete to maintain consistency',
                           affiliate_id INT unsigned NOT NULL COMMENT 'Foreign key for affiliate, cascades on delete to maintain consistency',
                           plan_id INT unsigned NOT NULL COMMENT 'Foreign key for plan, cascades on delete to maintain consistency',
                           plan_name VARCHAR(255) NOT NULL COMMENT 'Plan name',
                           validity_days INT NOT NULL COMMENT 'Validity in days',
                           price FLOAT NOT NULL COMMENT 'Price for the plan',
                           purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Purchase timestamp',
                           end_date DATETIME NOT NULL COMMENT 'Plan end date',
                           sessions_left SMALLINT NOT NULL COMMENT 'Remaining sessions',
                           FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- insert 5 user plans into the user plan table
INSERT INTO user_plan (user_id, affiliate_id, plan_id, plan_name, validity_days, price, end_date, sessions_left) VALUES (1, 1, 1, 'Plan 1', 30, 100.00, '2023-01-01 00:00:00', 10);
INSERT INTO user_plan (user_id, affiliate_id, plan_id, plan_name, validity_days, price, end_date, sessions_left) VALUES (2, 2, 2, 'Plan 2', 60, 200.00, '2023-01-02 00:00:00', 20);
INSERT INTO user_plan (user_id, affiliate_id, plan_id, plan_name, validity_days, price, end_date, sessions_left) VALUES (3, 3, 3, 'Plan 3', 90, 300.00, '2023-01-03 00:00:00', 30);
INSERT INTO user_plan (user_id, affiliate_id, plan_id, plan_name, validity_days, price, end_date, sessions_left) VALUES (4, 4, 4, 'Plan 4', 120, 400.00, '2023-01-04 00:00:00', 40);
INSERT INTO user_plan (user_id, affiliate_id, plan_id, plan_name, validity_days, price, end_date, sessions_left) VALUES (5, 5, 5, 'Plan 5', 150, 500.00, '2023-01-05 00:00:00', 50);



-- Affiliate Trainer table
DROP TABLE IF EXISTS affiliate_trainer;
CREATE TABLE affiliate_trainer (
                                   id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for affiliate trainer',
                                   affiliate_id INT unsigned NOT NULL COMMENT 'Foreign key for affiliate, cascades on delete for consistency',
                                   trainer_id INT unsigned NOT NULL COMMENT 'Foreign key for trainer (user), cascades on delete for consistency',
                                   UNIQUE (affiliate_id, trainer_id) COMMENT 'Prevent duplicate trainer-affiliate pairs',
                                   FOREIGN KEY (affiliate_id) REFERENCES affiliate(id) ON DELETE CASCADE,
                                   FOREIGN KEY (trainer_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Class Attendee table
DROP TABLE IF EXISTS class_attendee;
CREATE TABLE class_attendee (
                                id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for class attendee',
                                class_id INT unsigned NOT NULL COMMENT 'Foreign key for class schedule, cascades on delete to maintain consistency',
                                user_id INT unsigned NOT NULL COMMENT 'Foreign key for user, cascades on delete to maintain consistency',
                                user_plan_id INT unsigned NOT NULL COMMENT 'Foreign key for user plan',
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
                                UNIQUE (class_id, user_id) COMMENT 'Prevent duplicate registrations',
                                FOREIGN KEY (class_id) REFERENCES class_schedule(id) ON DELETE CASCADE,
                                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Class Leaderboard table
DROP TABLE IF EXISTS class_leaderboard;
CREATE TABLE class_leaderboard (
                                   id INT unsigned AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID for leaderboard entry',
                                   class_id INT unsigned NOT NULL COMMENT 'Foreign key for class schedule, cascades on delete to maintain consistency',
                                   user_id INT unsigned NOT NULL COMMENT 'Foreign key for user, cascades on delete to maintain consistency',
                                   score_type VARCHAR(50) NOT NULL COMMENT 'Type of score (e.g., rx, sc or beginner)',
                                   score VARCHAR(50) NOT NULL COMMENT 'Score value',
                                   created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
                                   FOREIGN KEY (class_id) REFERENCES class_schedule(id) ON DELETE CASCADE,
                                   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
