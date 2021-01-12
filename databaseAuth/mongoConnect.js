// GNU GENERAL PUBLIC LICENSE
// Version 3, 29 June 2007

// Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
// Everyone is permitted to copy and distribute verbatim copies
// of this license document, but changing it is not allowed.

//      Preamble

// The GNU General Public License is a free, copyleft license for
// software and other kinds of works.


const mongoose = require('mongoose');


const mongoConnect = async()=>{
const uri = process.env.MONGO_URI
mongoose.connect(uri,{
    dbName : 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=>{
    console.log('mongo connection successful')
}).catch((e)=>console.log(e.message))

mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})
mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose disconnected')
})

process.on('SIGINT',async()=>{
    await mongoose.connection.close()
    // process.exit(0)
})
}


module.exports = mongoConnect;