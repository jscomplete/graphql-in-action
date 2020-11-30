CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE SCHEMA IF NOT EXISTS azdev;

CREATE TABLE azdev.users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  hashed_password text NOT NULL,
  first_name text,
  last_name text,
  hashed_auth_token text,
  created_at timestamp without time zone NOT NULL
    DEFAULT (now() at time zone 'utc'),

  CHECK (lower(username) = username)
);

CREATE TABLE azdev.tasks (
  id serial PRIMARY KEY,
  content text NOT NULL,
  tags text,
  user_id integer NOT NULL,
  is_private boolean NOT NULL DEFAULT FALSE,
  approach_count integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone NOT NULL
    DEFAULT (now() at time zone 'utc'),

  FOREIGN KEY (user_id) REFERENCES azdev.users
);

CREATE TABLE azdev.approaches (
  id serial PRIMARY KEY,
  content text NOT NULL,
  user_id integer NOT NULL,
  task_id integer NOT NULL,
  vote_count integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone NOT NULL
    DEFAULT (now() at time zone 'utc'),

  FOREIGN KEY (user_id) REFERENCES azdev.users,
  FOREIGN KEY (task_id) REFERENCES azdev.tasks
);

INSERT INTO "azdev"."users"("username","hashed_password")
VALUES
(E'test',crypt('123456', gen_salt('bf')));

INSERT INTO "azdev"."tasks" ("content","tags","user_id","approach_count","is_private")
VALUES
(E'Make an image in HTML change based on the theme color mode (dark or light)',E'code,html',1,1,FALSE),
(E'Get rid of only the unstaged changes since the last git commit',E'command,git',1,1,FALSE),
(E'The syntax for a switch statement (AKA case statement) in JavaScript',E'code,javascript',1,2,FALSE),
(E'Calculate the sum of numbers in a JavaScript array',E'code,javascript',1,1,FALSE),
(E'Babel configuration file for "react" and "env" presets',E'config,javascript,node',1,1,TRUE),
(E'Create a secure one-way hash for a text value (like a password) in Node',E'code,node',1,1,FALSE);

INSERT INTO "azdev"."approaches" ("content","user_id","task_id","vote_count")
VALUES
(E'<picture>\n  <source\n    srcset="settings-dark.png"\n    media="(prefers-color-scheme: dark)"\n  />\n  <source\n    srcset="settings-light.png"\n    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"\n  />\n  <img src="settings-light.png" loading="lazy" />\n</picture>',1,1,0),
(E'git diff | git apply --reverse',1,2,0),
(E'switch (expression) {\n  case value1:\n    // do something when expression === value1\n    break;\n  case value2:\n    // do something when expression === value2\n    break;\n  default:\n    // do something when expression does not equal any of the values above\n}',1,3,5),
(E'function doSomethingFor(expression) {\n  switch (expression) {\n    case value1:\n      // do something when expression === value1\n      return;\n    case value2:\n      // do something when expression === value2\n      return;\n    default:\n      // do something when expression does not equal any of the values above\n  }\n}',1,3,18),
(E'arrayOfNumbers.reduce((acc, curr) => acc + curr, 0)',1,4,0),
(E'module.exports = {\n  presets: [\n    \'@babel/react\',\n    [\n      \'@babel/env\',\n      {\n        modules: \'commonjs\',\n        targets: [\n          \'> 1%\',\n          \'last 3 versions\',\n          \'ie >= 9\',\n          \'ios >= 8\',\n          \'android >= 4.2\',\n        ],\n      },\n    ],\n  ]\n};',1,5,0),
(E'const bcrypt = require(\'bcrypt\');\nconst hashedPass = bcrypt.hashSync(\'testPass123\', 10);',1,6,0);
