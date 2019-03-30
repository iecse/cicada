create user 'user' IDENTIFIED WITH mysql_native_password BY 'password';
grant all privileges on *.* to 'user'@'%';%