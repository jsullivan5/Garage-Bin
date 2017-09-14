const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const getItems = (req, res) => {
  database('items').select('*')
    .then(items => {
      res.status(200).json(items);
    })
    .catch(error => {
      res.status(500).json({ error })
    })
}

const addItem = (req, res) => {
  const newItem = req.body;

  database('items').insert(newItem, '*')
    .then(postedItem => {
      res.status(201).json(postedItem[0])
    })
    .catch(error => res.status(500).json({ error }));
}

module.exports = {
  getItems,
  addItem
}
