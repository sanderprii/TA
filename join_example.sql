SELECT 
    User.username, 
    User.fullName, 
    Training.type AS training_type, 
    Training.date AS training_date, 
    Training.score
FROM 
    User
INNER JOIN 
    Training 
ON 
    User.id = Training.userId
WHERE 
    Training.date > '2023-01-01'
ORDER BY 
    Training.date DESC;

-- This query retrieves user information along with their associated training details from the database.
-- It filters the results to include only training sessions that occurred after January 1, 2023, and 
-- sorts the results in descending order by the training date, displaying the most recent trainings first.

-- Tables Involved:
-- 1. User:
--    - Stores user details such as username and full name.
--    - Primary Key: id.
-- 2. Training:
--    - Stores training session details, including type, date, and score.
--    - Foreign Key: userId references User(id).

-- Query Explanation:
-- - The query selects the following columns:
--   - User.username: The username of the user.
--   - User.fullName: The full name of the user.
--   - Training.type (aliased as training_type): The type of training session.
--   - Training.date (aliased as training_date): The date when the training occurred.
--   - Training.score: The score achieved in the training session.
-- - The INNER JOIN ensures that only users with associated training records are included.
-- - The WHERE clause filters trainings to include only those conducted after '2023-01-01'.
-- - The ORDER BY clause sorts the results by training_date in descending order.

-- Example Data:
-- User Table:
-- | id | username  | fullName       |
-- |----|-----------|----------------|
-- | 1  | johndoe   | John Doe       |
-- | 2  | janedoe   | Jane Doe       |

-- Training Table:
-- | id | type     | date       | score   | userId |
-- |----|----------|------------|---------|--------|
-- | 1  | Cardio   | 2023-05-10 | 12:34   | 1      |
-- | 2  | Strength | 2023-04-12 | 100 kg  | 1      |
-- | 3  | Cardio   | 2023-03-08 | 15 km   | 2      |

-- Expected Output:
-- | username  | fullName       | training_type | training_date | score   |
-- |-----------|----------------|---------------|---------------|---------|
-- | johndoe   | John Doe       | Cardio        | 2023-05-10    | 12:34   |
-- | johndoe   | John Doe       | Strength      | 2023-04-12    | 100 kg  |
-- | janedoe   | Jane Doe       | Cardio        | 2023-03-08    | 15 km   |
