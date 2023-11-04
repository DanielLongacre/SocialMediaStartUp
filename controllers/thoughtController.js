const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a single thought
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
    // Create a thought
    async createThought(req, res) {
        try {
          const thought = await Thought.create(req.body);
          res.status(201).json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
      },
    // Update a thought
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
    // Delete a thought
    async deleteThought(req,res) {
        try {
            const thought = await Thought.findByIdAndDelete({_id:req.params.thoughtId});
            res.status(200).json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
      },


    // Create a reaction
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id:req.params.thoughtId},
                {$addToSet: {reactions: req.body}},
                {runValidators: true, new: true}
            );
            thought ? res.json(thought) : res.status(404).json({message: notFound});
        } catch (e) {
            res.status(500).json(e);
        }
    },

    // Delete a reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reactions: {reactionId: req.body.reactionId}}},
                {runValidators: true, new: true}
            );

            thought ? res.json(thought) : res.status(404).json({message: notFound});
        } catch (e) {
            res.status(500).json(e);
        }
    },
};