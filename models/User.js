const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

const userSchema = new Schema(
    {
        userName: { 
            type: String, 
            unique: true, 
            required: true, 
            trim: true 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: () => Promise.resolve(false),
                message: 'Email validation failed'
              }
        },
        thoughts: [Thought],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: true,
    }
);

userSchema
    .virtual('friendCount')
    .get(function() {
        return this.friends.length;
    });

const User = model('user', userSchema);

module.exports = User;