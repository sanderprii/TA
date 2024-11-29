DELIMITER //

-- Create a table to log changes to exerciseData
CREATE TABLE exercise_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT,
    old_exerciseData VARCHAR(255),
    new_exerciseData VARCHAR(255),
    changed_by VARCHAR(255),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
//

-- Create a trigger to log updates to exerciseData
CREATE TRIGGER after_exercise_update
AFTER UPDATE ON Exercise
FOR EACH ROW
BEGIN
    INSERT INTO exercise_log (
        exercise_id,
        old_exerciseData,
        new_exerciseData,
        changed_by,
        changed_at
    )
    VALUES (
        OLD.id,
        OLD.exerciseData,
        NEW.exerciseData,
        USER(),
        NOW()
    );
END;
//

-- Ensure password is at least 8 characters long
CREATE TRIGGER before_account_insert
BEFORE INSERT ON User
FOR EACH ROW
BEGIN
    IF CHAR_LENGTH(NEW.password) < 8 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Password must be at least 8 characters long';
    END IF;
END;
//

DELIMITER ;


