const usersModel = require("../models").Users;

exports.getUsers = (req, res) => {
  usersModel.findAll().then(
    (users) => {
      res.status(200).json(users);
    },
    (err) => {
      res.status(500).json(err);
    }
  );
};
exports.createUser = (req, res) => {
  const { username, password } = req.body;
  usersModel.findAll().then(
    (users) => {
      let flag = false;
      users.forEach((user) => {
        if (user.username === username) {
          flag = true;
        }
      });
      if (flag) {
        res.json({ status: 0, debug_data: "username already exists" });
      } else {
        usersModel
          .create({
            username: username,
            password: password,
            date_of_creation: new Date().toISOString(),
          })
          .then(
            (user) => {
              res.status(200).json({ status: 1, data: "user created" });
            },
            (err) => {
              res.status(500).json(err);
            }
          );
      }
    },
    (err) => {
      res.status(500).json(err);
    }
  );
};
exports.updateUser = (req, res) => {
  const { username, password } = req.body;
  usersModel
    .findOne({ where: { username: req.params.username } })
    .then((user) => {
      if (user !== null) {
        usersModel
          .update(
            {
              username: username,
              password: password,
              date_of_creation: new Date().toISOString(),
            },
            { where: { username: req.params.username } }
          )
          .then(
            (user) => {
              res
                .status(200)
                .json({ status: 1, data: "user details modified" });
            },
            (err) => {
              res.status(500).send(err);
            }
          );
      } else {
        res.json({ status: 0, debug_data: "user not found" });
      }
    });
};
exports.deleteUser = (req, res) => {
  usersModel.destroy({ where: { username: req.params.username } }).then(
    (user) => {
      if (user === 0)
        res.status(500).json({ status: 0, debug_data: "user not found" });
      else {
        res.status(200).json({ status: 1, data: "user deleted successfully" });
      }
    },
    (err) => {
      res.status(500).send(err);
    }
  );
};

exports.checkLogin = (req, res) => {
  const { username, password } = req.body;
  usersModel.findAll().then(
    (users) => {
      let flag = false;
      users.forEach((user) => {
        if (user.username === username && user.password === password) {
          flag = true;
        }
      });
      if (flag) {
        req.session["isLoggedIn"] = 1;
        req.session["username"] = username;
        res.status(200).json({ status: 1, data: username });
      } else {
        req.session["isLoggedIn"] = 0;
        res.status(200).json({ status: 0, data: "incorrect login details" });
      }
    },
    (error) => {
      res.status(500).json(error);
    }
  );
};
exports.loginUser = (req, res) => {
  if (req.session.isLoggedIn === 1) {
    usersModel.findOne({ where: { username: req.session.username } }).then(
      (userOb) => {
        res.status(200).json({ status: 1, data: userOb });
      },
      (err) => {
        res.status(500).json(err);
      }
    );
  } else {
    res.status(200).json({ status: 0, debug_data: "you are not logged in " });
  }
};
