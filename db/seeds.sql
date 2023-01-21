INSERT INTO department (id, name)
VALUES (100, "Sales"),
       (200, "Janitorial"),
       (300, "IT");

INSERT INTO role (id, title, salary, department_id)
VALUES (301, "Programmer", 80000, 300),       
       (302, "Testing", 60000, 300),
       (101, "Sales Rep", 70000, 100),
       (102, "Junior Sales Rep", 30000, 100),
       (202, "Floor Cleaner", 40000, 200),
       (203, "Window Washer", 50000, 200),
       (201, "Cleaning Leader", 80000, 200);
    

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Violet", "Bass", 301, NULL),
       (002, "Calvin", "Menace", 302, 001),
       (003, "Beatrice", "Worg", 101, NULL),
       (004, "Hubert", "Hool", 202, 006),
       (005, "Yhorm", "Giant", 203, 006),
       (006, "Anais", "Deflew", 201, NULL),
       (007, "Runky", "Reeves", 102, 003);

