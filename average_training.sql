
-- How many active users where last month

SELECT 
COUNT(DISTINCT userID) AS active_users_last_month
FROM Training
WHERE 
date >= DATE_SUB(NOW(), INTERVAL 1 MONTH);

-- How many WOD training has been done overall with WOD name

SELECT 
COUNT(*) AS WOD_training
FROM Training
WHERE wodName IS NOT NULL AND wodType = 'WOD';

