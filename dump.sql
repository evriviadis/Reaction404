CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE scores (
    score_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE achievements (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE user_achievements (
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_username ON users(username);

CREATE INDEX idx_users_nickname ON users(nickname);

CREATE INDEX idx_scores_user_id ON scores(user_id);

CREATE INDEX idx_scores_score ON scores(score);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

/*views*/
/* no views available because of $ in js */

INSERT INTO achievements (id, name, description) VALUES
(1, 'Snail Pace', 'Achieve a reaction time of less than 300ms'),
(2, 'Rapid Reflexes', 'Achieve a reaction time of less than 200ms'),
(3, 'Hacker', 'Achieve a reaction time of less than 100ms'),
(4, 'First Time Player', 'Play the game 1 time'),
(5, 'Dedicated Player', 'Play the game 10 times'),
(6, 'Master Player', 'Play the game 100 times'),
(7, 'Professional', 'Achieve a top 10 score on the global leaderboard');

