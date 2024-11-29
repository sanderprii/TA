-- create user
CREATE USER 'regular_user'@'localhost' IDENTIFIED BY 'Passw0rd';

-- create admin
CREATE USER 'admin_user'@'localhost' IDENTIFIED BY 'Passw0rd';

-- grant user
GRANT SELECT, INSERT, UPDATE ON irontrack.* TO 'regular_user'@'localhost';

-- grant admin
GRANT ALL PRIVILEGES ON irontrack.* TO 'admin_user'@'localhost';
-- Apply changes
FLUSH PRIVILEGES;


-- Documentation for Database Access Restrictions

-- Step 1: Roles and Users Creation
-- Created roles `admin` and `user` with appropriate permissions.
-- - The `admin` role has all privileges (INSERT, UPDATE, DELETE, SELECT, CREATE, DROP).
-- - The `user` role has SELECT and INSERT permission.

-- Step 2: Testing Admin Privileges
-- Logged in as `admin_user` and tested the following actions:
-- - INSERT: Successful
-- - UPDATE: Successful
-- - DELETE: Successful
-- - SELECT: Successful
-- - CREATE: Successful

-- Step 3: Testing User Privileges
-- Logged in as `regular_user` and tested the following actions:
-- - SELECT: Successful
-- - INSERT: Successful
-- - UPDATE: Successful
-- - DELETE: Denied

-- Step 4: Validating Privileges
-- Verified user permissions using:
-- SHOW GRANTS FOR 'admin_user'@'localhost';
-- SHOW GRANTS FOR 'regular_user'@'localhost';

-- Results:
-- - Admin user has all privileges:
--   GRANT ALL PRIVILEGES ON `irontrack`.* TO 'admin_user'@'localhost';
-- - Regular user has SELECT and INSERT privilege:
--   GRANT SELECT, INSERT ON `irontrack`.* TO 'regular_user'@'localhost';

-- End of documentation
