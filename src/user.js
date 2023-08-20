const { createHmac } = require("crypto");
const UserRepository = require("./repositories/user.repository");

class User {
  constructor() {
    this.users = [];
    this.UserRepository = new UserRepository();
  }

  async create(body) {
    const { password } = body;
    const pwdEncrypt = createHmac("sha256", password).digest("hex");

    let user = {
      ...body,
      password: pwdEncrypt,
    };
    user = await this.UserRepository.create(user);

    return user;
  }

  async findAll() {
    return await this.UserRepository.findAll();
  }

  async update(body, id) {
    const userExists = await this.UserRepository.findById(id);

    if (!userExists) {
      throw new Error("user not found");
      return;
    }

    const { password } = body;
    const pwdEncrypt = createHmac("sha256", password).digest("hex");

    const user = {
      ...body,
      password: pwdEncrypt,
    };

    await this.UserRepository.update(user, id);
    return userExists;
  }
}

module.exports = new User();
