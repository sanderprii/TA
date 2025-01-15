

-- Tabel: Users
DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique user ID',
    username   VARCHAR(100) UNIQUE NOT NULL COMMENT 'Username, must be unique',
    email      VARCHAR(255) UNIQUE NOT NULL COMMENT 'User email, must be unique',
    password   VARCHAR(255)        NOT NULL COMMENT 'Hashed password',
    full_name  VARCHAR(255) COMMENT 'Full name of the user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'User creation timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp'
);

-- Tabel: Projects
DROP TABLE IF EXISTS projects;
CREATE TABLE projects
(
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique project ID',
    name        VARCHAR(255) NOT NULL COMMENT 'Project name',
    description TEXT COMMENT 'Project description',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Project creation timestamp',
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp'
);

-- Tabel: Issues
DROP TABLE IF EXISTS issues;
CREATE TABLE issues
(
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique issue ID',
    title       VARCHAR(255) NOT NULL COMMENT 'Issue title',
    description TEXT COMMENT 'Detailed description of the issue',
    status      ENUM ('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open' COMMENT 'Issue status',
    priority    ENUM ('Low', 'Medium', 'High', 'Critical')         DEFAULT 'Medium' COMMENT 'Issue priority',
    project_id  INT UNSIGNED NOT NULL COMMENT 'Foreign key to the project',
    assignee_id INT UNSIGNED COMMENT 'Foreign key to the assigned user',
    created_by  INT UNSIGNED NOT NULL COMMENT 'Foreign key to the user who created the issue',
    created_at  DATETIME                                           DEFAULT CURRENT_TIMESTAMP COMMENT 'Issue creation timestamp',
    updated_at  DATETIME                                           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
);

-- Tabel: Comments
DROP TABLE IF EXISTS comments;
CREATE TABLE comments
(
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique comment ID',
    issue_id   INT UNSIGNED NOT NULL COMMENT 'Foreign key to the issue',
    user_id    INT UNSIGNED NOT NULL COMMENT 'Foreign key to the user who commented',
    comment    TEXT         NOT NULL COMMENT 'Comment content',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Comment creation timestamp',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated timestamp',
    FOREIGN KEY (issue_id) REFERENCES issues (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tabel: Labels
DROP TABLE IF EXISTS labels;
CREATE TABLE labels
(
    id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique label ID',
    name  VARCHAR(100) UNIQUE NOT NULL COMMENT 'Label name',
    color VARCHAR(7) DEFAULT '#000000' COMMENT 'Label color in hex format'

);

-- Tabel: Issue_Labels (Many-to-Many relationship between issues and labels)
DROP TABLE IF EXISTS issue_labels;
CREATE TABLE issue_labels
(
    issue_id INT UNSIGNED NOT NULL COMMENT 'Foreign key to the issue',
    label_id INT UNSIGNED NOT NULL COMMENT 'Foreign key to the label',
    PRIMARY KEY (issue_id, label_id),
    FOREIGN KEY (issue_id) REFERENCES issues (id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE
);

-- Näidisandmed

-- Kasutajad
INSERT INTO users (username, email, password, full_name)
VALUES ('admin', 'admin@example.com', 'hashed_password', 'System Administrator'),
       ('user1', 'user1@example.com', 'hashed_password1', 'User One'),
       ('user2', 'user2@example.com', 'hashed_password2', 'User Two');

-- Projektid
INSERT INTO projects (name, description)
VALUES ('Project A', 'Description for Project A'),
       ('Project B', 'Description for Project B');

-- Issues
INSERT INTO issues (title, description, status, priority, project_id, assignee_id, created_by)
VALUES ('Fix Login Bug', 'Users are unable to log in.', 'Open', 'High', 1, 2, 1),
       ('Add Dark Mode', 'Implement dark mode for the application.', 'In Progress', 'Medium', 1, 2, 1),
       ('Update Documentation', 'Improve user guides and API documentation.', 'Open', 'Low', 2, NULL, 1);

-- Labels
INSERT INTO labels (name, color)
VALUES ('Bug', '#FF0000'),
       ('Feature', '#00FF00'),
       ('Documentation', '#0000FF');

-- Issue_Labels
INSERT INTO issue_labels (issue_id, label_id)
VALUES (1, 1),
       (2, 2),
       (3, 3);
