create table bird (
                      bird_id tinyint not null auto_increment,
                      name varchar(50),
                      description varchar(300),
                      primary key (bird_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table chat_claim (
                            chat_claim_id bigint not null auto_increment,
                            game_log_id bigint,
                            is_checked tinyint(1),
                            checked_dt datetime(2),
                            claimed_dt datetime(2),
                            primary key (chat_claim_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table game_log (
                          game_log_id bigint not null auto_increment,
                          chatting_dt datetime(2),
                          quiz_id int not null ,
                          room_id bigint not null ,
                          user_id int ,
                          chatting varchar(300),
                          primary key (game_log_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table game_room (
                           room_id bigint not null auto_increment,
                           location_id tinyint,
                           start_dt datetime(2),
                           end_dt datetime(2),
                           topic_id varchar(50),
                           status enum ('COMPLETED','IN_PROGRESS','MATCHING'),
                           primary key (room_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table game_room_participant (
                                       room_id bigint not null,
                                       user_id int not null,
                                       match_rank tinyint default 0,
                                       correct_count tinyint default 0,
                                       is_exited boolean default false,
                                       before_exp int,
                                       primary key (room_id, user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table game_room_quiz (
                                room_id bigint not null,
                                quiz_id int not null,
                                user_id int,
                                present_dt datetime(2) not null,
                                correct_dt datetime(2),
                                sequence tinyint,
                                primary key (room_id, quiz_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table game_tip (
                          tip_id integer not null auto_increment,
                          content varchar(256),
                          primary key (tip_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson (
                        lesson_id int not null auto_increment,
                        lesson_group_id int,
                        sample_voice_name varchar(512),
                        sample_voice_path varchar(512),
                        script varchar(100),
                        graph_x varchar(4096),
                        graph_y varchar(4096),
                        last_update_dt datetime(2),
                        is_deleted tinyint(1),
                        primary key (lesson_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson_category (
                                 lesson_category_id tinyint not null auto_increment,
                                 name varchar(20) not null,
                                 primary key (lesson_category_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson_claim (
                              lesson_claim_id int not null auto_increment,
                              lesson_id int not null,
                              user_id int not null,
                              content varchar(500),
                              claim_dt datetime(2),
                              primary key (lesson_claim_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson_group (
                              lesson_group_id int not null auto_increment,
                              lesson_category_id tinyint,
                              location_id tinyint,
                              name varchar(100),
                              primary key (lesson_group_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson_group_result (
                                     lesson_group_result_id bigint not null auto_increment,
                                     lesson_group_id int not null,
                                     user_id int not null,
                                     avg_similarity tinyint,
                                     avg_accuracy tinyint,
                                     start_dt datetime(2) not null,
                                     end_dt datetime(2),
                                     is_completed tinyint(1),
                                     primary key (lesson_group_result_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson_result (
                               lesson_result_id bigint not null auto_increment,
                               lesson_group_result_id bigint not null ,
                               lesson_id int not null,
                               accent_similarity tinyint,
                               pronunciation_accuracy tinyint,
                               lesson_dt datetime(2),
                               is_skipped tinyint(1),
                               primary key (lesson_result_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson_record_file (
                                    lesson_record_file_id bigint not null auto_increment,
                                    lesson_result_id bigint,
                                    user_voice_file_name varchar(512),
                                    user_voice_file_path varchar(512),
                                    user_voice_script varchar(100),
                                    primary key (lesson_record_file_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table lesson_record_graph (
                                     lesson_record_graph_id bigint not null auto_increment,
                                     lesson_result_id bigint,
                                     graph_x varchar(4096),
                                     graph_y varchar(4096),
                                     primary key (lesson_record_graph_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table location (
                          location_id tinyint not null auto_increment,
                          name varchar(50),
                          primary key (location_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table quiz (
                      quiz_id int not null auto_increment,
                      location_id tinyint not null,
                      question varchar(300) not null,
                      creation_dt datetime(2) not null,
                      is_objective tinyint(1) not null,
                      primary key (quiz_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table quiz_choice (
                             quiz_id int not null,
                             choice_id tinyint not null,
                             content varchar(300),
                             is_answer tinyint(1),
                             primary key (quiz_id, choice_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;

create table user (
                      user_id int not null auto_increment,
                      location_id tinyint,
                      email varchar(50) not null,
                      nickname varchar(50) not null,
                      password varchar(64),
                      reg_date datetime(2) not null,
                      exp int,
                      gender enum ('DEFAULT','FEMALE','MALE'),
                      age_range enum ('CHILD','DEFAULT','EIGHTEEN','FIFTEEN','FOURTEEN','NINETEEN','SEVENTEEN','SIXTEEN','TEENAGER','THIRTEEN','TWENTEEN'),
                      role enum ('ADMIN','BANNED','BASIC'),
                      is_deleted tinyint(1),
                      deleted_dt datetime(2),
                      return_dt datetime(2),
                      bird_id tinyint,
                      primary key (user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_general_ci;


alter table chat_claim
    add constraint fk_chat_claim_game_log_id
        foreign key (game_log_id)
            references game_log (game_log_id)
            on delete cascade
            on update cascade;

alter table game_log
    add constraint fk_game_log_quiz_id
        foreign key (quiz_id)
            references quiz (quiz_id)
            on delete cascade
            on update cascade;

alter table game_log
    add constraint fk_game_log_room_id
        foreign key (room_id)
            references game_room (room_id)
            on delete cascade
            on update cascade;

alter table game_log
    add constraint fk_game_log_user_id
        foreign key (user_id)
            references user (user_id)
            on delete set null
            on update cascade;

alter table game_room
    add constraint fk_game_room_location_id
        foreign key (location_id)
            references location (location_id)
            on delete set null
            on update cascade;

alter table game_room_participant
    add constraint fk_game_room_participant_room_id
        foreign key (room_id)
            references game_room (room_id)
            on delete cascade
            on update cascade;

alter table game_room_participant
    add constraint fk_game_room_participant_user_id
        foreign key (user_id)
            references user (user_id)
            on delete cascade
            on update cascade;

alter table game_room_quiz
    add constraint fk_game_room_quiz_quiz_id
        foreign key (quiz_id)
            references quiz (quiz_id)
            on delete cascade
            on update cascade;

alter table game_room_quiz
    add constraint fk_game_room_quiz_room_id
        foreign key (room_id)
            references game_room (room_id)
            on delete cascade
            on update cascade;

alter table game_room_quiz
    add constraint fk_game_room_quiz_user_id
        foreign key (user_id)
            references user (user_id)
            on delete cascade
            on update cascade;

alter table lesson
    add constraint fk_lesson_lesson_group_id
        foreign key (lesson_group_id)
            references lesson_group (lesson_group_id)
            on delete set null
            on update cascade;

alter table lesson_claim
    add constraint fk_lesson_claim_lesson_id
        foreign key (lesson_id)
            references lesson (lesson_id)
            on delete cascade
            on update cascade;

alter table lesson_claim
    add constraint fk_lesson_claim_user_id
        foreign key (user_id)
            references user (user_id)
            on delete cascade
            on update cascade;

alter table lesson_group
    add constraint fk_lesson_group_lesson_category_id
        foreign key (lesson_category_id)
            references lesson_category (lesson_category_id)
            on delete set null
            on update cascade;

alter table lesson_group
    add constraint fk_lesson_group_location_id
        foreign key (location_id)
            references location (location_id)
            on delete set null
            on update cascade;

alter table lesson_group_result
    add constraint fk_lesson_group_result_lesson_group_id
        foreign key (lesson_group_id)
            references lesson_group (lesson_group_id)
            on delete cascade
            on update cascade;

alter table lesson_group_result
    add constraint fk_lesson_group_result_user_id
        foreign key (user_id)
            references user (user_id)
            on delete cascade
            on update cascade;

alter table lesson_result
    add constraint fk_lesson_result_lesson_id
        foreign key (lesson_id)
            references lesson (lesson_id)
            on delete cascade
            on update cascade;

alter table lesson_result
    add constraint fk_lesson_result_lesson_group_result_id
        foreign key (lesson_group_result_id)
            references lesson_group_result (lesson_group_result_id)
            on delete cascade
            on update cascade;


alter table lesson_record_file
    add constraint fk_lesson_record_file_lesson_result_id
        foreign key (lesson_result_id)
            references lesson_result (lesson_result_id)
            on delete cascade
            on update cascade;

alter table lesson_record_graph
    add constraint fk_lesson_record_graph_lesson_result_id
        foreign key (lesson_result_id)
            references lesson_result (lesson_result_id)
            on delete cascade
            on update cascade;

alter table quiz
    add constraint fk_quiz_location_id
        foreign key (location_id)
            references location (location_id)
            on delete cascade
            on update cascade;

alter table quiz_choice
    add constraint fk_quiz_choice_quiz_id
        foreign key (quiz_id)
            references quiz (quiz_id)
            on delete cascade
            on update cascade;

alter table user
    add constraint fk_user_bird_id
        foreign key (bird_id)
            references bird (bird_id)
            on delete set null
            on update cascade;

alter table user
    add constraint fk_user_location_id
        foreign key (location_id)
            references location (location_id)
            on delete set null
            on update cascade;