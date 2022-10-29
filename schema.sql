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


/* TOP Emojis received */

CREATE OR REPLACE FUNCTION public.top_emoji_received (user_id text)
	RETURNS TABLE (
		emoji text, count integer)
	LANGUAGE sql
	AS $function$
	(
		SELECT
			emoji,
			count(*) AS count
		FROM
			reactions
		LEFT JOIN discord_integrations AS di ON di.discord_id = reactions.receiver_id
	WHERE
		di.user_id = user_id
	GROUP BY
		emoji
	LIMIT 3)
$function$

/* get the top_givers on your account */

CREATE OR REPLACE FUNCTION public.top_count_givers (target_id uuid)
	RETURNS TABLE (
		giver_name text, giver_image text, giver_wallet text, count integer)
	LANGUAGE sql
	AS $function$	
	(
		SELECT
			profiles.name AS giver_name,
			profiles.image AS giver_image,
			pusers.wallet_address AS giver_wallet,
			count
		FROM (
			SELECT
				sender_id,
				count(*) AS count
			FROM
				reactions
			LEFT JOIN discord_integrations AS di ON di.discord_id = reactions.receiver_id
		WHERE
			di.user_id = target_id
		GROUP BY
			sender_id
		LIMIT 3) AS count_sender_messages
	LEFT JOIN discord_integrations ON discord_integrations.discord_id = count_sender_messages.sender_id
	LEFT JOIN profiles ON profiles.user_id = discord_integrations.user_id
	LEFT JOIN public.users AS pusers ON pusers.id = discord_integrations.user_id)
$function$

--- CREATE A VIEW FOR ALL THE SERVERS + COUNT ---

SELECT
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
