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
    });
};

const addItem = (req, res) => {
  const newItem = req.body;

  for (const requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!newItem[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        data: {
          error: `Missing required parameter ${requiredParameter}.`,
        },
      });
    }
}

  database('items').insert(newItem, '*')
    .then(postedItem => {
      res.status(201).json(postedItem[0])
    })
    .catch(error => res.status(500).json({ error }));
};

const updateItem = (req, res) => {
  const id = req.params.id;
  const newCleanliness = req.body;

  database('items')
    .update(newCleanliness, 'cleanliness')
    .where('id', parseInt(id, 10))
    .returning('*')
    .then((item) => {
      res.status(200).json({
        status: 'Success',
        data: item[0]
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 'Error',
        data: error
      });
    });
};

module.exports = {
  getItems,
  addItem,
  updateItem
};
