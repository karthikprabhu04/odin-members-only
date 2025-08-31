const pool = require("./pool");

async function addUser(firstName, lastName, username, password) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password) VALUES
    ($1, $2, $3, $4) RETURNING id;`,
    [firstName, lastName, username, password]
  );

  return result.rows[0].id;
}

async function checkUsernameAvailability(username) {
  const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  if (result.rows.length > 0) {
    throw new Error("Username already taken");
  }
  return true;
}

async function updateMembershipStatus(userId) {
  await pool.query(
    `
    UPDATE users SET membershipstatus = TRUE WHERE id = $1
    `,
    [userId]
  );
}

async function findUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

async function addNewMessage(title, content, userId) {
  await pool.query(
    `
    INSERT INTO messages (title, content, user_id) VALUES
    ($1, $2, $3)
    `,
    [title, content, userId]
  );
}

async function getAllMessages() {
  const { rows } = await pool.query(
    `
    SELECT users.username, messages.title, messages.content, messages.timestamp 
    FROM messages 
    JOIN users ON users.id = messages.user_id
    ORDER BY messages.timestamp DESC;
    `
  );
  return rows;
}

module.exports = {
  addUser,
  checkUsernameAvailability,
  updateMembershipStatus,
  findUserById,
  addNewMessage,
  getAllMessages,
};
