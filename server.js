const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./server/router');

const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Garage Bin';

app.use(express.static(path.resolve(__dirname, './public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

module.exports = app;
