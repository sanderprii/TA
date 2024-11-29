-- 1. Successful Transaction
-- This transaction adds a training session and a related exercise.
-- If both operations succeed, changes are committed.
-- If any operation fails, the entire transaction is rolled back.
START TRANSACTION;

-- First operation: Insert into Training table
INSERT INTO Training (type, wodName, wodType, userId)
VALUES ('WOD', 'HELEN11', 'EMOM', 1);

-- Second operation: Insert into Exercise table
INSERT INTO Exercise (exerciseData, trainingId)
VALUES ('Deadlift: 3x11', LAST_INSERT_ID());

-- Commit, if both operations succeed
COMMIT;

-- Rollback when one of the operations fail
ROLLBACK;



-- 2. Unsuccessful Transaction
-- This transaction attempts to add a training session with an invalid userId.
-- Since the first operation fails, the entire transaction is rolled back.
START TRANSACTION;

-- First operation: Insert into Training table with invalid userId
INSERT INTO Training (type, wodName, wodType, userId)
VALUES ('Weightlifting', 'JENNY', 'WOD', 9999);

-- Second operation: Insert into Exercise table
INSERT INTO Exercise (exerciseData, trainingId)
VALUES ('Snatch: 1x11', LAST_INSERT_ID());

-- Commit, if both operations succeed
COMMIT;

-- Rollback when one of the operations fail
ROLLBACK;
