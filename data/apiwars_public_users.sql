create table users
(
    id       serial       not null
        constraint users_pkey
            primary key,
    username varchar(50)  not null
        constraint users_username_key
            unique,
    password varchar(200) not null
);

alter table users
    owner to tudor;

INSERT INTO public.users (id, username, password) VALUES (1, 'b', '$2b$12$ak9gwQ0yr/2aML4HB8JqHuKJNAUFzvJn5PLrzh3ksQzNZxA8gfrcW');
INSERT INTO public.users (id, username, password) VALUES (2, 'j', '$2b$12$mqoZyiKro1TZAAAGstgLGeZ5Qjbr3FlIMGVEMAU2U/Th4XjuAQCuG');
INSERT INTO public.users (id, username, password) VALUES (3, 'a', '$2b$12$qPWwhRwuo7/UqxXRtDySeuUy6kCUObwiFuY0dMXH14FyHuY4mpqZK');