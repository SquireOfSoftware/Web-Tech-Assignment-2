select shift_start, shift_end, User.first_name, User.last_name, Role.role_name from Shift, User, Role
where (User.user_id = Shift.user_id) and (User.email LIKE "%smith%") and 
(Shift.shift_start < "2017-09-18T00:00:00") and 
(Shift.shift_end > "2017-09-11T00:00:00") and 
(Role.role_id = Shift.role_id);