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
