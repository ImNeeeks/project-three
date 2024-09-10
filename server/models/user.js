const { Schema, model } = require('mongoose');
const bcyrpt = require('bcrypt');

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use valid email address'],
        },
        password: {
            type: String,
            required: true,
            unique: true,
        }
        // category reference here?
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

userSchema.pre('save', asynce function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.pasword = await bcyrpt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function (password) {
    return bcyrpt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;