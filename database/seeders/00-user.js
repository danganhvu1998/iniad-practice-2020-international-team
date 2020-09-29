const bCrypt = require('bcrypt');
module.exports = {
    up: (queryInterface) => {
    return queryInterface.bulkInsert('users', [
        {
            fullName: 'Vu',
            email: 'danganhvu1998@gmail.com',
            password: bCrypt.hashSync('initPass', bCrypt.genSaltSync(8), null),
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            fullName: 'Member',
            email: 's1f101800058@iniad.org',
            password: bCrypt.hashSync('initPass', bCrypt.genSaltSync(8), null),
            createdAt: new Date(),
            updatedAt: new Date(),
        }, {
            fullName: 'Member',
            email: 'danganhvu6298@gmail.com',
            password: bCrypt.hashSync('initPass', bCrypt.genSaltSync(8), null),
            createdAt: new Date(),
            updatedAt: new Date(),
        },{
            fullName: 'Duong',
            email: 's1f101800676@iniad.org',
            password: bCrypt.hashSync('initPass', bCrypt.genSaltSync(8), null),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ], {});
  },

  down: (queryInterface) =>
  queryInterface.bulkDelete('users', null, {})

  };
