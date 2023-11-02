const User = require('../models/User');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('thoughts');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const updateUserData = await User.findOneAndUpdate(
        { _id: req.params.userId}, 
        req.body,
        {new: true}
        )
        .select('-__v');

      if (!updateUserData) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
  
      res.json(updateUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const delUser = await User.findOneAndDelete({ _id: req.params.userId });

      if(!delUser) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json({ message: `User ${delUser.username} was successfully deleted!` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};
