const User = require('../models/User');

module.exports = {
  // Find all users
  getUsers(req, res) {
    User.find({})
      .then(userData => res.json(userData))
      .catch(err => res.status(500).json(err));
  },
  // Find a user by id
  getSingleUser(req, res) {
    User.findById(req.params.userId)
      .then(userData => res.json(userData))
      .catch(err => res.status(500).json(err));
  },
  // Create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a user by id
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
  // Delete a user by id
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
  },


  // Add a new friend to friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: {friends: req.body.friendId || req.params.friendId} },
      { new: true }
    )
    .then(userData => {
      if(!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(userData);
    })
    .catch(err => res.status(500).json(err));
  },


  // Delete Friend from friend list
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json({ message: "Friend removed successfully!" });
      })
      .catch((err) => res.status(400).json(err));
  },

};
