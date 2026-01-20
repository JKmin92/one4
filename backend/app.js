const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(cookieParser());
app.use(cors({origin: 'http://localhost:5173', credentials: true}));

module.exports = app;