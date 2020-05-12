create table "planet-votes"
(
    id              serial       not null
        constraint "planet-votes_pkey"
            primary key,
    planet_id       integer      not null,
    planet_name     varchar(100) not null,
    user_id         integer
        constraint "planet-votes_user_id_fkey"
            references users,
    submission_time timestamp
);

alter table "planet-votes"
    owner to tudor;

INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (6, 38, 'Aleen Minor', 2, '2020-04-18 12:32:40.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (7, 51, 'Mirial', 2, '2020-04-18 12:42:19.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (9, 41, 'Tund', 2, '2020-04-18 12:43:40.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (20, 4, 'Hoth', 1, '2020-04-18 15:29:08.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (21, 5, 'Dagobah', 1, '2020-04-18 15:29:44.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (22, 7, 'Endor', 1, '2020-04-18 15:35:23.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (23, 12, 'Utapau', 1, '2020-04-18 15:47:22.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (24, 13, 'Mustafar', 1, '2020-04-18 15:53:21.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (25, 10, 'Kamino', 2, '2020-04-18 15:53:49.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (26, 20, 'Stewjon', 2, '2020-04-18 15:53:55.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (31, 14, 'Kashyyyk', 3, '2020-04-18 21:32:46.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (33, 23, 'Rodia', 1, '2020-04-18 22:09:47.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (36, 1, 'Tatooine', 2, '2020-04-18 22:22:29.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (37, 2, 'Alderaan', 2, '2020-04-18 22:41:00.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (38, 1, 'Tatooine', 1, '2020-04-18 22:42:52.000000');
INSERT INTO public."planet-votes" (id, planet_id, planet_name, user_id, submission_time) VALUES (39, 2, 'Alderaan', 1, '2020-04-18 23:18:33.000000');