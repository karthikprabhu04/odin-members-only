const { Client } = require("pg");
require("dotenv").config();

async function main() {
  console.log("seeding...");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query("BEGIN");

  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        membershipStatus BOOLEAN DEFAULT FALSE
      )
    `);

    let countUsers = await client.query("SELECT COUNT(*) FROM users");
    if (parseInt(countUsers.rows[0].count) === 0) {
      // Insert mock users
      await client.query(`
        INSERT INTO users (first_name, last_name, username, password, membershipStatus) VALUES
          ('Bryan', 'Smith', 'bryan_s', 'password123', TRUE),
          ('Odin', 'Johnson', 'odin_j', 'secret456', FALSE),
          ('Damon', 'Lee', 'damon_l', 'mypassword', TRUE)
      `)
    }

    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        content TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    let countMessages = await client.query("SELECT COUNT(*) FROM messages");
    if (parseInt(countMessages.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO messages (title, content, user_id) VALUES
          ('Welcome', 'Hello everyone! Excited to join this platform.', 1),
          ('Question', 'Does anyone know how to reset their password?', 2),
          ('Announcement', 'Our new feature goes live tomorrow!', 3)
      `)
    }

    await client.query("COMMIT");
    console.log("Seeding completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.log("Error during seeding:", err);
  } finally {
    await client.end();
  }
}

main();
