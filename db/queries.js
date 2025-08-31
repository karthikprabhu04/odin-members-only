const pool = require("./pool");

async function addUser(firstName, lastName, username, password, adminstatus) {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password, adminstatus) VALUES
    ($1, $2, $3, $4, $5) RETURNING id;`,
    [firstName, lastName, username, password, adminstatus]
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

async function getAllMessages(membershipstatus) {
  const query = membershipstatus
    ? `
      SELECT messages.id, users.username, messages.title, messages.content, messages.timestamp 
      FROM messages 
      JOIN users ON users.id = messages.user_id
      ORDER BY messages.timestamp DESC;
      `
    : `
      SELECT title, content, timestamp 
      FROM messages 
      ORDER BY timestamp DESC;
      `;

  const { rows } = await pool.query(query);
  return rows;
}

async function getAdminStatus(userId) {
  const { rows } = await pool.query(
    `SELECT adminstatus FROM users WHERE id = $1`,
    [userId]
  );
  return rows[0].adminstatus;
}

async function removeMessage(id) {
  await pool.query(`
    DELETE FROM messages WHERE id = $1
    `, [id])
}

module.exports = {
  addUser,
  checkUsernameAvailability,
  updateMembershipStatus,
  findUserById,
  addNewMessage,
  getAllMessages,
  getAdminStatus,
  removeMessage,
};
