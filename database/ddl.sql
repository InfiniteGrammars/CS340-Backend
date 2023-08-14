/*
group 54: Sofia Escoto & Alex Hollinghead 
A new social media app
*/

/* to reduce errors, disable foreign key checks and autocommit at first */
set foreign_key_checks = 0;
set autocommit = 0; 

/*create tables */
drop table if exists `Users`;
create table `Users` ( 
	user_id int auto_increment, 
    email varchar(320) not null, 
    join_date datetime default now(), 
    hashed_password varchar(64) not null,
    username varchar(32) unique not null, 
    display_name varchar(64), 
    bio varchar(128),
    profile_pic blob,
    primary key (user_id)
); --allows for storing emojis

drop table if exists `Groups`;
create table `Groups` ( 
	group_id int auto_increment, 
    group_name varchar(64), 
    creator_id int not null, 
    time_created datetime default now(),
    primary key (group_id), 
    foreign key (creator_id) references Users(user_id)
); 

drop table if exists `Group_Members`;
create table `Group_Members` ( 
	group_id int,
    member_id int,
    time_joined datetime default now(), 
    primary key (group_id, member_id), 
    foreign key (group_id) references `Groups`(group_id) on delete cascade,
    foreign key (member_id) references Users(user_id) on delete cascade
);


drop table if exists `Posts`;
create table `Posts` ( 
	post_id int auto_increment, 
    user_id int not null, 
    post_body varchar(280) not null, 
    time_posted datetime default now(), 
    group_posted int default null, 
    primary key (post_id),
    foreign key (user_id) references Users(user_id), 
    foreign key (group_posted) references `Groups`(group_id) on delete set null
);

Drop table if exists `Direct_Messages`;
create table `Direct_Messages` ( 
	message_id int auto_increment, 
    sender_id int not null, 
    receiver_id int not null, 
    time_sent datetime default now(), 
    message_content varchar(512) not null, 
    primary key (message_id),
    foreign key (sender_id) references Users(user_id),
    foreign key (receiver_id) references Users(user_id)
);

drop table if exists `Reports`;
create table `Reports` ( 
	report_id int auto_increment,
    reported_post int not null,
    status tinyint(1) default 0,
    notes longtext,
    primary key (report_id),
    foreign key (reported_post) references Posts(post_id) on delete cascade
);

drop table if exists `User_Reports`;
create table `User_Reports` ( 
    report_id int,
    reporting_user int, 
    time_reported datetime not null default now(), 
    report_reason varchar(255) not null, 
    primary key (report_id, reporting_user), 
    foreign key (report_id) references Reports(report_id) on delete cascade,
    foreign key (reporting_user) references Users(user_id)
);

drop table if exists `Follows`;
create table `Follows` ( 
	user_id int, 
    follower_id int,
    time_followed datetime default now(), 
    primary key (user_id, follower_id),
    foreign key (user_id) references Users(user_id) on delete cascade,
    foreign key (follower_id) references Users(user_id) on delete cascade
);



/*insert in sample data*/

insert into Users (email, join_date, hashed_password, username, display_name, bio)
values 
('admin@birdapp.com', 
'2023-01-01 00:00:00', 
'82edcbefd01b5e2b8f6cf98e7de9s9fca89815d7cb0e2mda3e3d1432e37b904a',
'admin', null, null), 
('margot_robbie@actmail.com',
 '2023-01-15 13:00:00',
 '9a7dcbefd01b5e2b8f6cf98e7d83e9fca89815d7cb0ef67a3e3d1432e37b904a',
 'MargotR',
 'Margot Robbie',
 'Actress. Barbie in the streets, Tonya Harding on the ice.'),
('bakingqueen78@hotmail.com',
'2023-02-05 09:30:00',
'5e79ff9bd908ffbfd8b82c4218c7ae90a33d2f32e48b6996a86863e182c48794',
'MarysBakes', 
"Mary's Artisan Bakery",
'Baking is my passion, sharing it is my joy.'),
('notdril@gmail.com', 
'2023-03-07 07:45:00', 
'53d67097711d69da5a405b2331e8b7e59f8b3022a421a7b934892487b8181e43',
'NotDril',
'Absolutely Not Dril', 
'Not @dril'),
('liam@fazeclan.com', 
'2023-03-31 20:20:00', 
'2d8b6020a65da07fa8b2b9b0533f079784d47b3f58e7d76a6e4d6b414a2eeb77',
'Liam0',
"Liam (eSports)",
'Professional gamer. Fortnite champion. Esports is life.'),
('techenthusiast@gurureviews.com', 
'2023-06-10 15:30:00', 
'3d1f3ef76fbc1ec5a3c61831556a26d37b1c8a26d8f1f83b8b0a1d85fa72b709',
'TechyZone', 
"Evan the Tech Guru", 
'Demystifying tech, one gadget at a time. Videos every Wednesday.');

insert into `Groups` (group_name, creator_id, time_created) 
values ("Margot's Fans", 2, '2023-02-01 15:00:00'), 
("Bakers Unite", 3, '2023-03-10 10:30:00'), 
("Nerd Alert", 6, '2023-04-15 20:45:00'); 

insert into Posts (user_id, post_body, time_posted, group_posted) 
values 
(2,
"Exciting news coming soon! Stay Tuned!",
'2023-01-20 14:00:00',
null),
(3, 
"Just baked a fresh batch of croissants! #Baking",
'2023-02-10 11:00:00',
2),
(4, 
"Food $200
Data $150
Rent $800
Candles $3,600
Utility $150
someone who is good at the economy please help me budget this. my family is dying",
'2023-03-08 12:30:00',
null), 
(5, 
"Another cringe take by @TechyZone. If anyone knows where this man lives lmk",
'2023-04-01 22:00:00', 
3),
(6,
"Reviewing the new iPhone today. Stay tuned! #TechReviews",
'2023-06-15 16:00:00',
null), 
(2, 
"Thanks for all the love and support. You guys are the best! <3",
'2023-02-05 18:00:00',
1),
(3, 
"Sharing my secret bread recipe on the blog! #BakingSecrets",
'2023-03-15 10:00:00',
2),
(4,
"IF THE ZOO BANS ME FOR HOLLERING AT THE ANIMALS I WILL FACE GOD AND WALK BACKWARDS INTO HELL",
'2023-03-25 14:30:00',
null),
(5, 
"Practice makes perfect. Keep grinding! #Esports",
'2023-04-05 21:30:00',
3),
(6, 
"Apple or Android? What's your preference? (There is a right answer - think fruits) #TechDebate",
'2023-06-25 17:00:00',
3);

insert into Direct_Messages(sender_id, receiver_id, time_sent, message_content)
values 
(6, 2, '2023-01-20 15:00:00', 
"Hello, m'lady... Perchance you've seen my Youtube channel?"),
(6, 2, '2023-01-27 17:30:00', 
"M'lady... Seen the latest iPhone?"),
(3, 5, '2023-01-29 13:00:00',
"Hey, Liam! What's your favorite bread?"), 
(6, 2, '2023-02-02 14:45:00',
"Hello, m'lady... How are you liking this new app? I'd love to interview you for my channel..."),
(5, 3, '2023-02-03 15:00:00',
"I love a good challa!"),
(6, 2, '2023-02-07 16:30:00', 
"Hello, m'lady... Android or iOS?"),
(4, 3, '2023-02-08 12:00:00', 
"Can you bake a chicken into a loaf of bread?"),
(3, 4, '2023-02-09 13:15:00',
"That's a strange request, but why not!"),
(6, 2, '2023-02-10 15:00:00', 
"M'lady..."), 
(6, 2, '2023-02-12 19:00:00',
"Good evening, m'lady!"),
(5, 3, '2023-02-14 17:00:00',
"Any baking tips for a beginner?"),
(3, 5, '2023-02-15 14:30:00',
"Sure, start with simple recipes! I recommend cookies for an absolute beginner, and then no-knead bread if you're ready for something more challenging. Check out my blog for recipes <3");


insert into Reports(reported_post, status, notes) 
values (4, "not evaluated", null); 

insert into User_Reports(report_id, reporting_user, time_reported, report_reason) 
values (1, 6, "2023-04-02 09:00:00", 
"This post seems threatening. I do not feel safe on your website."), 
(1, 3, "2023-04-02 10:00:00", 
"User is inciting violence."), 
(1, 4, "2023-04-02 11:00:00", 
"Potential doxxing attempt.");


insert into Follows (user_id, follower_id, time_followed) 
values (1, 2, '2023-01-21 10:00:00'),
(2, 4, '2023-01-23 09:00:00'), 
(2, 5, '2023-01-25 14:00:00'),
(2, 6, '2023-01-27 11:00:00'),
(3, 2, '2023-02-01 09:00:00'), 
(4, 2, '2023-02-05 14:00:00'),
(6, 4, '2023-02-15 13:00:00'),
(3, 5, '2023-03-02 10:00:00'),
(4, 6, '2023-03-10 12:00:00'),
(5, 2, '2023-03-20 15:00:00'),
(6, 3, '2023-03-25 16:00:00'), 
(5, 4, '2023-04-05 09:00:00');

insert into Group_Members (group_id, member_id, time_joined) 
values (1, 1, '2023-02-01 15:00:00'),
(1, 3, '2023-02-02 09:00:00'),
(1, 4, '2023-02-03 14:00:00'),
(1, 6, '2023-02-07 11:00:00'),
(2, 3, '2023-03-10 10:30:00'),
(2, 2, '2023-03-12 09:00:00'),
(2, 5, '2023-03-15 10:00:00'), 
(3, 6, '2023-04-15 20:45:00'),
(3, 4, '2023-04-22 13:00:00');



set foreign_key_checks = 1;
set autocommit = 1;