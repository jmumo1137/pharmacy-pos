exports.seed = async function(knex) {
  await knex('roles').del();
  await knex('roles').insert([
    { name: 'Admin', description: 'Full access' },
    { name: 'Pharmacist', description: 'Inventory + sales' },
    { name: 'Cashier', description: 'Only sales' },
  ]);
};
