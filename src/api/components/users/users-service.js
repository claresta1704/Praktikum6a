const bcrypt = require ('bcrypt');
const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');
const { errorResponder } = require('../../../core/errors');
const { errorTypes } = require('../../../core/errors');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} passwordConfirm - Password confirmation
 * @returns {boolean}
 */
async function createUser(name, email, password, passwordConfirm) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword, passwordConfirm);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Change Password
 * @param {string} id - ID
 * @param {string} oldPassword - Old password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @return {object}
 */

async function changePassword(id, oldPassword, newPassword, confirmPassword) {
  try {
    const user = await usersRepository.getUser(id);
    if (!user) {
      return null; 
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw errorResponder(errorTypes.INVALID_PASSWORD, 'Password saat ini dan Old Password tidak sama');
    }

    if (newPassword !== confirmPassword) {
      throw errorResponder(errorTypes.INVALID_PASSWORD, 'Konfirmasi password baru salah');
    }

    const hashedNewPassword = await hashPassword(newPassword);

    user.password = hashedNewPassword;
    await user.save();

    return {
      email: user.email,
      id: user.id,
    };
  } catch (error) {
    throw error; 
  }
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function isEmailRegistered(email) {
  const users = await usersRepository.getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isEmailRegistered,
  changePassword,
};
