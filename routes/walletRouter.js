const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const {
  createWallet,
  getSingleWallet,
  deleteSingleWallet,
  deleteAllWallet,
  deleteUserWallet,
  editSingleWallet,
  getWallet,
} = require('../controllers/walletController');

router
  .route('/')
  .post(auth, createWallet)
  .delete(auth, authPermission('admin', 'owner'), deleteAllWallet);

router.route('/allWallet').get(getWallet);

router
  .route('/:id')
  .get(getSingleWallet)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleWallet)
  .patch(auth, editSingleWallet);

router.route('/:id/deleteUserWallet').delete(auth, deleteUserWallet);

module.exports = router;
