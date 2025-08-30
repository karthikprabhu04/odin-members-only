const pool = require("./pool");

async function addUser(firstName, lastName, username, password) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, username, password) VALUES
    ($1, $2, $3, $4);`,
    [firstName, lastName, username, password]
  );
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

module.exports = {
  addUser,
  checkUsernameAvailability,
};
