module.exports = (sequelize, DataTypes) => {
    const UserToken = sequelize.define('UserToken', {
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        token: {
            allowNull: false,
            type: DataTypes.BLOB,
        },
        email: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        type: {
            allowNull: false,
            type: DataTypes.ENUM('reset_password', 'active_user', 'refresh_token'),
        },
    }, {
        tableName: 'user_tokens',
    });
    UserToken.associate = function (models) {
        UserToken.belongsTo(models.User, {
            as: 'user',
            targetKey: 'id',
            foreignKey: 'userId',
        });
    };
    return UserToken;
};
