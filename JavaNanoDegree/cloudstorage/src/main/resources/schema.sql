CREATE TABLE IF NOT EXISTS USERS (
  userid INT PRIMARY KEY auto_increment,
  username VARCHAR(20) UNIQUE,
  salt VARCHAR,
  password VARCHAR,
  firstname VARCHAR(20),
  lastname VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS NOTES (
    noteid INT PRIMARY KEY auto_increment,
    notetitle VARCHAR(20),
    notedescription VARCHAR (1000),
    userid INT,
    foreign key (userid) references USERS(userid)
);

CREATE TABLE IF NOT EXISTS FILES (
    fileId SERIAL PRIMARY KEY,
    filename VARCHAR(255),
    contenttype VARCHAR(255),
    filesize VARCHAR(255),
    userid INT,
    filedata BLOB,
    FOREIGN KEY (userid) REFERENCES USERS(userid)
);

CREATE TABLE IF NOT EXISTS CREDENTIALS (
    credentialid INT PRIMARY KEY AUTO_INCREMENT,
    url VARCHAR(100),
    username VARCHAR(30),
    "key" VARCHAR, -- Use double quotes to escape the reserved keyword
    password VARCHAR,
    userid INT,
    FOREIGN KEY (userid) REFERENCES USERS(userid)
);