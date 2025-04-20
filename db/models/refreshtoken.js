'use strict';
const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class refreshToken extends Model {

    //generate token and store it in db
    static async generateToken( userId ) {
      const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || '7d';
      const token = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + (parseInt(process.env.JWT_REFRESH_EXPIRATION_SECONDS) || 604800));
      return await refreshToken.create( { token, userId, expiryDate } );
    }

    //verify token 
    static async verifyToken( token ) {
      try {
        const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const { userId } = decode;

        const storedToken = await refreshToken.findOne({ where: { token, userId } });
       
        if (!storedToken) return null;
        //check if the token is expired
        if (storedToken.expiryDate.getTime() < new Date().getTime()) {
          await storedToken.destroy(); 
          return null;
        }
        return storedToken;
      } catch (error) {
        return null;
      }
    }
    static async deleteToken( token, userId ) {
      return await refreshToken.destroy({ where: { token, userId } });
    }
    
    static associate(models) {
      // define association here
      refreshToken.belongsTo(models['Users'],  {foreignKey: 'userId', as: 'user'})
    }
  }
  refreshToken.init({
    token: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'refreshToken',
  });
  return refreshToken;
};