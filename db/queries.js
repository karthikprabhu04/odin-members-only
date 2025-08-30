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
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  if (result.rows.length > 0) {
    throw new Error("Username already taken");
  }
  return true;
}

async function updateMembershipStatus(userId) {
  await pool.query(`
    UPDATE users SET membershipstatus = TRUE WHERE id = $1
    `, [userId])
}

module.exports = {
  addUser,
  checkUsernameAvailability,
  updateMembershipStatus,
};
