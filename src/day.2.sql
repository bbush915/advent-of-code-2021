-- Input --

CREATE TABLE input (
	line_number SERIAL PRIMARY KEY,
	command text NOT NULL
);

CREATE UNIQUE INDEX input_pkey ON input(line_number int4_ops);

-- Part 1 --

WITH 
	cte_commands AS (
		SELECT
			split_part(command, ' ', 1) AS direction,
			split_part(command, ' ', 2) :: integer AS value
		FROM
			input
		ORDER BY
			line_number
	),
	cte_final_state AS (
		SELECT
			sum(CASE WHEN direction = 'forward' THEN value ELSE 0 END) AS position,
			sum(
				CASE direction
					WHEN 'down' THEN value 
					WHEN 'up' THEN -value
					ELSE 0 
				END
			) AS depth
		FROM
			cte_commands
	)
SELECT
	position * depth AS answer
FROM
	cte_final_state;
	
-- Part 2 --

WITH 
	cte_commands AS (
		SELECT
			split_part(command, ' ', 1) AS direction,
			split_part(command, ' ', 2) :: integer AS value,
			line_number
		FROM
			input
	),
	cte_commands_with_aim AS (
		SELECT
			direction,
			value,
			sum(
				CASE direction
					WHEN 'down' THEN value
					WHEN 'up' THEN -value
					ELSE 0
				END
			) OVER ( ORDER BY line_number ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW ) AS aim
		FROM
			cte_commands
		ORDER BY
			line_number
	),
	cte_final_state AS (
		SELECT
			sum(CASE WHEN direction = 'forward' THEN value ELSE 0 END) AS position,
			sum(CASE WHEN direction = 'forward' THEN value * aim ELSE 0 END) AS depth
		FROM
			cte_commands_with_aim
	)
SELECT
	position * depth AS answer
FROM
	cte_final_state;