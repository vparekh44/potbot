/* TOP Emojis received */

CREATE OR REPLACE FUNCTION top_emoji_received(user_id text)
 RETURNS TABLE(emoji text, count integer)
 LANGUAGE sql
AS $$
	(
		SELECT
			emoji,
			count(*) AS count
		FROM
			reactions
		WHERE
			receiver_id = user_id
		GROUP BY
			emoji
		LIMIT 3)
$$


/* get the top_givers on your account */

CREATE FUNCTION top_count_givers (user_id text)
	RETURNS TABLE (
		sender_id text, sender_user_id uuid, count int)
	AS $$
	(
		SELECT
			sender_id,
			user_discord_id AS sender_user_id,
			count(*) AS count
		FROM
			reactions
		WHERE
			receiver_id = user_id
		GROUP BY
			sender_id,
			user_discord_id
		LIMIT 3)
$$
LANGUAGE SQL;