# How to run the database
Install XAMPP
https://www.apachefriends.org/index.html
- Run MySQL server (it might be using MariaDB, which is fine as well)
- Record the details of the MySQL server connection

Install MySQL workbench
https://www.mysql.com/products/workbench/
- Connect MySQL workbench with the MySQL server 

Open the scheduledb.mwb
- Go to the menu and select Database | Forward engineer
- Go through the prompts and you should be able to generate the schema on MySQL
- Optionally you can select to use some of the dummy data provided in the schema

And that is it.