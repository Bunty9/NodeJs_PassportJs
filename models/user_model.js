// GNU GENERAL PUBLIC LICENSE
// Version 3, 29 June 2007

// Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
// Everyone is permitted to copy and distribute verbatim copies
// of this license document, but changing it is not allowed.

//      Preamble

// The GNU General Public License is a free, copyleft license for
// software and other kinds of works.





const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username:{
        type: String,
        required : true,
        unique: false,
        trim: true,
        minlength: 3
    },
    email:{
        type: String,
        required : true,
        unique: true,
        trim: true,
        minlength: 5
    },
    password:{
        type: String,
        required : true,
        unique: true,
        trim: true,
        minlength: 8
    }
},{
    timestamps: true,
});

const User = mongoose.model('User',UserSchema);

module.exports = User;
