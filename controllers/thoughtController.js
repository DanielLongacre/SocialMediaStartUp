const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');

                if (!thought) {
                    return res.status(404).json({ message: 'No thought with that ID' });
                }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const dbThoughtData = await Thought.create(req.body);
            const userPost = await User.findByIdAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: dbThoughtData._id } },
                { new: true }
            );

            if (!userPost) {
                return res
                .status(404).json({ message: 'Post created, but found no user with that ID' });
            }

            res.json('Successfully created a post!');
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const updateThoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                req.body,
                {new: true}
                )
                .select('-__v');
            if (!updateThoughtData) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(updateThoughtData);
        } catch(err) {
            res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const delThought = await Thought.findOneAndDelete({ _id:req.params.thoughtId});

            if(!delThought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json({ message: `Thought ${thoughtId} was successfully deleted!` });
        } catch (err) {
            res.status(500).json(err);
        }
    }
};