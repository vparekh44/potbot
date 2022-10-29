/* TOP Emojis received */

CREATE OR REPLACE FUNCTION top_emoji_received (user_id text)
	RETURNS TABLE (
		emoji text, count integer)
	LANGUAGE sql
	AS $$
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
$$

/* get the top_givers on your account */

CREATE OR REPLACE FUNCTION top_count_givers (user_id text)
	RETURNS TABLE (
		giver_id uuid, count int)
	AS $$
	(
		SELECT
			user_id AS giver_id,
			count
		FROM (
			SELECT
				sender_id,
				count(*) AS count
			FROM
				reactions
			LEFT JOIN discord_integrations AS di ON di.discord_id = reactions.receiver_id
		WHERE
			di.user_id = user_id
		GROUP BY
			sender_id
		LIMIT 3) AS count_sender_messages
	LEFT JOIN discord_integrations ON discord_integrations.discord_id = sender_id)
$$
LANGUAGE SQL;