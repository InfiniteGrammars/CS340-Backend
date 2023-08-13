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

--select post using postID 
select reported_post from Reports where reported_post = :reported_post_Input; 

--delete report (will also delete corresponding post_reports - good, done in ddl) 
delete from Reports where report_id = :report_id_Input


/* 
queries for users
*/ 

--select everyting from users 
select * from Users;

--insert into Users 
insert into Users (email, join_date, hashed_password, username, display_name, bio, profile_pic) 
values (:email_Input, DateTime.Now(), :hashed_password_Input, 
         :username_Input, :display_name_Input, :bio_Input, :profile_pic_Upload);

--select a user's following list from user_id
select follower_id as followers from Follows 
where user_id = :user_id_Input; 

--select a user's following list from username ? (seems like it'd be easier for the person trying to access followers)
select follower_id as followers from Follows 
inner join Users on Follows.user_id = Users.user_id 
where username = :username_Input;

--select a user's group membership from group_members 
select group_id from Group_Members 
where member_id = :user_id_Input; 

--delete a user 
-- --> deleting a user won't affect any of their posts or messages. ONLY follows and groups they're a part of.
delete from Users where user_id = :user_id_Input;

--change username (must still be unique)
update Users 
set username = :new_username_Input 
where username = :old_username_Input 
where not exists (
   select * from Users where username = :new_username_Input
);

--follow a new person
insert into Follows (user_id, follower_id)
values (
   (select user_id from Users where username = :to_follow_Input), 
   (select user_id from Users where username = :current_user_Input)
);

--unfollow a person 
delete from Follows 
where user_id = (select user_id from Users where username = :to_unfollow_from_drop_down) 
and follower_id = (select user_id from Users where username = :current_user_Input)


/*
queries for groups 
*/ 

--select everything from groups 
select * from Groups;

--insert into groups 
insert into Groups (group_name, creator_id, time_created)
values (:group_name_Input, :creator_id_Input, DateTime.Now()); 

--select group members based on group ID 
select member_id from Group_Members 
where group_id = :group_id_Input;

--select posts based on group ID 
select * from Posts 
inner join Groups where Posts.group_posted = Groups.post_id; 

--delete a group (all posts in the group now set group_posted to null - good, done in ddl)
delete from Groups where group_id = :group_id_Input;

--remove a person from a group 
delete from Group_Members 
where group_id = :group_from_drop_down and member_id = :user_id_Input;

/* 
queries for posts 
*/ 

--select everything from posts 
select * from Posts; 

--insert into posts 
insert into Posts (user_id, post_body, time_posted, group_posted)
values (:user_id_Input, :post_body_Input, DateTime.Now(), :group_posted_from_drop_down);

--delete post (deletes any referencing reports - good, done in ddl)
delete from Posts where post_id = :post_id_Input; 


--change a post group ID 
update Posts 
set group_posted = :group_posted_Input 
where post_id = :post_id_Input;

--select group names & IDs that a specific post was posted in
select group_name, group_id from Groups 
inner join Posts on Groups.group_id = Posts.group_posted 
where Posts.post_id = :post_id_Input;

/* 
queries for direct_messages 
*/

--select everything from dms 
select * from Direct_Messages;

--insert into dms 
insert into Direct_Messages (sender_id, receiver_id, time_sent, message_content)
values (:sender_id_Input, :receiver_id_Input, DateTime.Now(), :message_content_Input); 

--select all messages to/from a given user
select * from Direct_Messages
where sender_id = :user_id_Input or receiver_id = :user_id_Input; 

--select all messages between two given users 
select * from Direct_Messages 
where sender_id = :sender_id_Input and receiver_id = :receiver_id_Input
or (sender_id = :receiver_id_Input and receiver_id = :sender_id_Input);
