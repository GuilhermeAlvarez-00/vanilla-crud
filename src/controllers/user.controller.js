const user = require("../user");

class UserController {
  async post(req, res) {
    const { body } = req;
    const result = await user.create(body);
    return res.end(JSON.stringify(result));
  }

  async put(req, res) {
    const { body } = req;
    const id = req.url.split("/")[req.url.split("/").length - 1];

    try {
      await user.update(body, id);

      return res.end(JSON.stringify({ message: "user updated" }));
    } catch (error) {
      res.end(JSON.stringify({ message: error.message }));
    }
  }

  async get(req, res) {
    const result = await user.findAll();
    return res.end(JSON.stringify(result));
  }
}

module.exports = { UserController };
