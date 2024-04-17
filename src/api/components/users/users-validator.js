const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,32}$/)
        .label('Password')
        .messages({
          'string.pattern.base': 'Password wajib mengandung kombinasi huruf besar, huruf kecil, simbol, dan angka',
        }),
      passwordConfirm: joi.string().min(6).max(32).required().label('Password_Confirm'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      oldPassword: joi.string().min(6).max(32).required().label('Old Password'),
      newPassword: joi.string().min(6).max(32).required().label('New Password')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,32}$/)
        .label('New Password')
        .messages({
          'string.pattern.base': 'Password wajib mengandung kombinasi huruf besar, huruf kecil, simbol, dan angka',
        }),
      newPasswordConfirm: joi.string().min(6).max(32).required().label('New Password Confirm'),
    },
  },
};