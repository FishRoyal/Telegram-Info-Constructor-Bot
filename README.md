# Telegram Info Constructor Bot
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   
![GIF](https://media.giphy.com/media/1zgvdrxG7lRkabGbwB/giphy.gif)

The bot allows you to build your system of directories and subdirectories directly in the telegram.
## About  
For a usual user this bot is just sort of menu. A user pushes telegram inline buttons to go deeper into subdirectories until he reaches the latest 
level, where some content's waiting for him. A user on each step can go back level or go back to main menu.  
For admin of this bot it's also possible to use "/edit" command, which allows to add and delete categories and decide which levet of subdirectories
is the last. Also this command allows to set some content to this subdirectory by post forwarding (markup allowed).
## TODO
1) Add possibility for admin to choose language of his bot (now only Russian is supported).
2) Add possibility set content with photo/video etc.
3) Add possibility for admin to add/delete other admins who can edit categories and content but can't add other admins.
4) Rewrite from mysql queries to Prisma.
5) Add clicking statistics.
6) Save user data ("current data" field) to db. Because for now it saves in class UserData.
## Getting Started
1) Install mysql
2) Create db (db_name)
3) Create table (table_name): 
```bash
CREATE TABLE card_tree (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `parent_id` BIGINT NULL,
  `name` VARCHAR(50) NOT NULL,
  `content` TEXT NULL
) TYPE=InnoDB DEFAULT CHARSET=utf8;
 
CREATE INDEX _tree ON card_tree (parent_id);
 
ALTER TABLE card_tree ADD CONSTRAINT _tree
  FOREIGN KEY (parent_id) REFERENCES card_tree (id) ON UPDATE CASCADE ON DELETE CASCADE;
```
4) Create user with login (user_login) and password (user_password)
5) Give privileges for this user to db_name.table_name
6) Go to telegram BotFather and create new bot with command /newbot. Then get api_key
7) Copy github repo and install dependencies:
```bash
git clone git@github.com:FishRoyal/Telegram-Info-Constructor-Bot.git
cd Telegram-Info-Constructor-Bot
npm install
```
8) Create .env in root directory and place your data:  
```bash
HOST="localhost"  
USER_="user_login"  
PASSWORD="user_password"  
DATABASE="db_name"  
API_KEY="api_key"  
TABLE_NAME="cards_tree"  
ADMIN="your_telegram_username"  
```
9) Compile and start the project:
```bash
npx tsc
node build/src/index.js
```
10) Go to telegram bot, write /start, then /edit and add something...
