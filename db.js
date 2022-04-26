const express = require('express');
const db = require('mongoose');
const url = 'mongodb+srv://amran-quantum:15Ks@Fa-54@cluster0.je7z8.mongodb.net/test?retryWrites=true&w=majority';
const connectDb = async function () {
    await db.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected succussfully!");
}

module.exports = connectDb;