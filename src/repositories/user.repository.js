const { client } = require("../database");
const { randomUUID } = require("crypto");

class UserRepository {
  constructor() {
    this.client = client;
  }

  async create({ name, username, email, password }) {
    const id = randomUUID();

    await this.client.query(
      "INSERT INTO USERS(ID, NAME, USERNAME, EMAIL, PASSWORD) VALUES ($1, $2, $3, $4, $5)",
      [id, name, username, email, password]
    );

    const user = Object.assign({
      id,
      name,
      username,
      email,
    });

    return user;
  }

  async findAll() {
    const result = await this.client.query("SELECT * FROM USERS");
    return result.rows;
  }

  async findById(id) {
    const { rows } = await this.client.query(
      "SELECT * FROM USERS WHERE ID = $1 LIMIT 1",
      [id]
    );

    if (rows.length) return rows[0];

    return null;
  }

  async update(props, id) {
    const keys = Object.keys(props);

    const keysToUpdate = keys.reduce((acc, cur, index, arr) => {
      const isSingleOrLast =
        arr.length - 1 === index || arr.length === 1 ? "" : ",";

      acc += ` ${cur.toUpperCase()} = $${index + 1}${isSingleOrLast}`;
      return acc;
    }, "");

    const query = `UPDATE USERS SET${keysToUpdate} WHERE ID = $${
      Object.keys(props).length + 1
    }`;

    await this.client.query(query, [...Object.values(props), id]);
  }
}

module.exports = UserRepository;
