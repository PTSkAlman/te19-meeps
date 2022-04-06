const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
require('dotenv').config();

const indexRouter = require('./routes/index');
const meepsRouter = require('./routes/meeps');
const editRouter = require('./routes/edit');
const nunjucks = require('nunjucks');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/meeps', meepsRouter);
app.use('/edit', editRouter);


nunjucks.configure('views', {
  autoescape: true,
  express: app
});

module.exports = app;
