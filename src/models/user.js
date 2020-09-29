module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        fullName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        birthday: {
            type: DataTypes.DATE,
        },
        gender: {
            allowNull: false,
            type: DataTypes.ENUM('male', 'female', 'other'),
            defaultValue: 'other',
        },
    }, {
        tableName: 'users',
    });
    // eslint-disable-next-line no-unused-vars
    User.associate = function (models) {
    };
    return User;
};
