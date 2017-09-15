/*
-- Query: select shift_start, shift_end, User.first_name, User.last_name from Shift, User
where (User.user_id = Shift.user_id) and (User.email LIKE "%smith%")
LIMIT 0, 1000

-- Date: 2017-09-15 20:18
*/
INSERT INTO `TABLE` (`shift_start`,`shift_end`,`first_name`,`last_name`) VALUES ('2017-09-12 14:00:00','2017-09-12 17:00:00','John','Smith');
INSERT INTO `TABLE` (`shift_start`,`shift_end`,`first_name`,`last_name`) VALUES ('2017-09-13 14:00:00','2017-09-13 17:00:00','John','Smith');
INSERT INTO `TABLE` (`shift_start`,`shift_end`,`first_name`,`last_name`) VALUES ('2017-09-14 14:00:00','2017-09-14 17:00:00','John','Smith');
INSERT INTO `TABLE` (`shift_start`,`shift_end`,`first_name`,`last_name`) VALUES ('2017-09-12 14:00:00','2017-09-12 17:00:00','Jane','Smith');
