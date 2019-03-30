drop table `submissions`;

create table if not exists `submissions` (
    `utoken` varchar(100) not null,
    `uid` int not null,
    `question` int not null,
    `submittedFlag` varchar(100) not null,
    `correctAnswer` int not null,
    `points` bigint default 0,
    `timeSinceStart` bigint default 0
);