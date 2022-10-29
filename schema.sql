create table "users" (
  id uuid primary key not null,
  wallet_address text not null unique,
  nonce text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

create table "profiles" (
    id uuid primary key not null,
    user_id uuid not null unique references "user" (id) on delete cascade,
    name text not null,
    bio text,
    image text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

create table "discord_integrations" (
    id uuid primary key not null,
    user_id uuid not null references "user" (id) on delete cascade,
    discord_id number not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

create table "reactions" (
    id uuid primary key not null,
    sender_id number not null,
    receiver_id number not null,
    emoji text not null,
    server_id number not null,
    message_id number not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
);

create or replace function select_unique_guild_ids() returns text as $$
  select distinct server_id from reactions;
$$ language sql;



CREATE OR REPLACE VIEW leaderboard AS SELECT test.count, test.receiver_id, users.wallet_address from (select count(receiver_id), receiver_id, user_id from (select reactions.id, reactions.sender_id, reactions.receiver_id, reactions.emoji, discord_integrations.user_id from reactions left outer join  discord_integrations on reactions.receiver_id = discord_integrations.discord_id) as reactions_view group by (receiver_id, user_id) ) as test left outer join users on test.user_id = users.id where wallet_address is NOT NULL;

CREATE OR REPLACE VIEW unique_guilds AS SELECT  select distinct server_id from reactions;

CREATE OR REPLACE VIEW server_stats AS SELECT
    u.wallet_address,
    server_count.server_id,
    server_count.count
FROM (
    SELECT
        server_id,
        count(*) AS count,
        t.receiver_id
    FROM (
        SELECT
            receiver_id
        FROM
            reactions
        UNION
        SELECT
            sender_id
        FROM
            reactions) AS t
        INNER JOIN reactions ON reactions.receiver_id = t.receiver_id
    GROUP BY
        server_id,
        t.receiver_id) AS server_count
    INNER JOIN discord_integrations di ON di.discord_id = server_count.receiver_id
    INNER JOIN public.users u ON u.id = di.user_id;

