/* 
Group 54: Sofia Escoto & Alex Hollinghead
a new social media app (bird app)
dml, sample data and selection
SELECT, INSERT, UPDATE and DELETE
*/ 

/* 
queries for reports 
*/ 

--select everything from reports 
select * from Reports;

--to have a user report a post, first:
--mark the post as reported (if not already in Reports)
insert into Reports (reported_post, status, notes) 
values (:reported_post_Input, :status_from_drop_down, :notes_Input)
where not exists ( 
   select reported_post from Reports where reported_post = :reported_post_Input
);
-- then add the user's report comments and stuff to User_Reports
insert into User_Reports (report_id, reporting_user, report_reason) 
values ((select report_id from Reports where reported_post = :reported_post_Input),
         :user_id_Input, :report_reason_Input);

--update the notes on a report 
update Reports
set notes = :new_notes_Input 
where report_id = :report_id_Input;

--get user reports by report id 
select * from User_Reports
where report_id = :report_id_Input;

--update report status
update Reports
set status = :status_Input 
where report_id = :report_id_Input;

--delete report (will also delete corresponding post_reports - good, done in ddl) 
delete from Reports where report_id = :report_id_Input;


/* 
queries for users
*/ 

--select everything from users 
select * from Users;

--insert into Users 
insert into Users (email, join_date, hashed_password, username, display_name, bio, profile_pic) 
values (:email_Input, DateTime.Now(), :hashed_password_Input, 
         :username_Input, :display_name_Input, :bio_Input, :profile_pic_Upload);

--delete a user 
-- --> deleting a user won't affect any of their posts or messages. ONLY follows and groups they're a part of.
delete from Users where user_id = :user_id_Input;


/*
queries for groups 
*/ 

--select everything from groups 
select * from Groups;

--insert into groups 
insert into Groups (group_name, creator_id, time_created)
values (:group_name_Input, :creator_id_Input, DateTime.Now()); 

--select group members based on group ID 
select username, user_id from Users
inner join Group_Members on Users.user_id = Group_Members.member_id
where group_id = :group_id_Input;

--select posts based on group ID 
select * from Posts 
inner join Groups where Posts.group_posted = Groups.post_id; 

--delete a group (all posts in the group now set group_posted to null - good, done in ddl)
delete from Groups where group_id = :group_id_Input;

--create a new group
insert into Groups (group_name, creator_id)
values (:group_name_Input, :creator_id_Input);

--remove a person from a group 
delete from Group_Members 
where group_id = :group_from_drop_down and member_id = :user_id_Input;

--add a person to a group
insert into Group_Members (group_id, member_id) 
values (:group_id_Input, :member_id_Input);

/* 
queries for posts 
*/ 

--select everything from posts 
select * from Posts; 

--get post from id 
select * from Posts
where post_id = :post_id_Input;

--get posts by user 
select * from Posts 
inner join Users on Posts.user_id = Users.user_id 
where Users.user_id = :user_id_Input;

--insert into posts 
insert into Posts (user_id, post_body, time_posted, group_posted)
values (:user_id_Input, :post_body_Input, DateTime.Now(), :group_posted_from_drop_down);

--delete post (deletes any referencing reports - good, done in ddl)
delete from Posts where post_id = :post_id_Input; 

--change a post group ID 
update Posts 
set group_posted = :group_posted_Input 
where post_id = :post_id_Input;


/* 
queries for direct_messages 
*/

--select everything from dms
select * from Direct_Messages;

--insert into dms 
insert into Direct_Messages (sender_id, receiver_id, time_sent, message_content)
values (:sender_id_Input, :receiver_id_Input, DateTime.Now(), :message_content_Input); 

--select all messages to a given user
select * from Direct_Messages
where receiver_id = :user_id_Input; 

--select all messages from a given user
select * from Direct_Messages 
where sender_id = :user_id_Input;

--select all messages between two given users 
select * from Direct_Messages 
where sender_id = :sender_id_Input and receiver_id = :receiver_id_Input
or (sender_id = :receiver_id_Input and receiver_id = :sender_id_Input);
