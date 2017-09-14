
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(function () {
      return Promise.all([
        knex('items').insert([
          {
            name: 'bike',
            reason: 'lazy',
            cleanliness: 'Dusty'
          },
          {
            name: 'tools',
            reason: 'manly',
            cleanliness: 'Sparkling'
          }
        ])
      ])
      .then(() => console.log('Done seeding.'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    });
};
