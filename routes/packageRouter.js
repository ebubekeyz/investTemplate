const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const authPermission = require('../middleware/authPermission');

const {
  createPackage,
  getSinglePackage,
  deleteSinglePackage,
  deleteAllPackages,
  getAllPackages,
  deleteUserPackage,
  editSinglePackage,
  getPackages,
  editUserPackage,
} = require('../controllers/packageController');

router
  .route('/')
  .get(auth, getAllPackages)
  .post(auth, createPackage)
  .delete(auth, authPermission('admin', 'owner'), deleteAllPackages);

router.route('/allPack').get(getPackages);

router
  .route('/:id')
  .get(getSinglePackage)
  .delete(auth, authPermission('admin', 'owner'), deleteSinglePackage)
  .patch(auth, editSinglePackage);

router.route('/:id/deleteUserPackage').delete(auth, deleteUserPackage);
router.route('/:id/editUserPackage').patch(auth, editUserPackage);

module.exports = router;
