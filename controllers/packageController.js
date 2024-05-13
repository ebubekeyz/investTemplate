const Package = require('../models/Package');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const createPackage = async (req, res) => {
  req.body.user = req.user.userId;
  const package = await Package.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: package });
};

const getAllPackages = async (req, res) => {
  let { user, coin, date, status, amount, sort, packageAmount, packagePlan } =
    req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Package.find(queryObject);

  if (user) {
    result = Package.find({
      user: { $eq: user },
    });
  }

  if (coin) {
    result = Package.find({
      coin: { $regex: coin, $options: 'i' },
    });
  }

  if (status) {
    result = Package.find({
      status: { $eq: status },
    });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (amount) {
    result = Package.find({ amount: { $lte: amount } });
  }
  if (packageAmount) {
    result = Package.find({
      'package.amount': { $lte: packageAmount },
    });
  }
  if (packagePlan) {
    result = Package.find({
      'package.plan': { $regex: plan, $options: 'i' },
    });
  }

  if (date) {
    result = Package.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const packages = await result;

  const totalPackages = await Package.countDocuments();
  const numOfPage = Math.ceil(totalPackages / limit);

  res.status(StatusCodes.OK).json({
    Packages: packages,
    meta: {
      pagination: { page: page, total: totalPackages, pageCount: numOfPage },
    },
  });
};

const getPackages = async (req, res) => {
  let { user, coin, date, status, amount, sort, packageAmount, packagePlan } =
    req.query;

  let result = Package.find({});

  if (user) {
    result = Package.find({
      user: { $eq: user },
    });
  }

  if (coin) {
    result = Package.find({
      coin: { $regex: coin, $options: 'i' },
    });
  }

  if (status) {
    result = Package.find({
      status: { $eq: status },
    });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (amount) {
    result = Package.find({ amount: { $lte: amount } });
  }
  if (packageAmount) {
    result = Package.find({
      'package.amount': { $lte: packageAmount },
    });
  }
  if (packagePlan) {
    result = Package.find({
      'package.plan': { $regex: packagePlan, $options: 'i' },
    });
  }

  if (date) {
    result = Package.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const packages = await result;

  const totalPackages = await Package.countDocuments();
  const numOfPage = Math.ceil(totalPackages / limit);

  res.status(StatusCodes.OK).json({
    Packages: packages,
    meta: {
      pagination: { page: page, total: totalPackages, pageCount: numOfPage },
    },
  });
};

const getSinglePackage = async (req, res) => {
  const { id: packageId } = req.params;
  const package = await Package.findOne({ _id: packageId });
  if (!package) {
    throw new BadRequestError(`Package with id ${packageId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ package: package });
};

const editSinglePackage = async (req, res) => {
  const { id: packageId } = req.params;
  const package = await Package.findOneAndUpdate({ _id: packageId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!package) {
    throw new BadRequestError(`Package with id ${packageId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ package: package });
};

const deleteSinglePackage = async (req, res) => {
  const { id: packageId } = req.params;
  const package = await Package.findByIdAndDelete({ _id: packageId });
  if (!package) {
    throw new BadRequestError(`Package with id ${packageId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Package Deleted' });
};

const deleteAllPackages = async (req, res) => {
  const package = await Package.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Packages Deleted' });
};

const deleteUserPackage = async (req, res) => {
  const { id: userId } = req.params;
  const package = await Package.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Package successfully deleted' });
};

module.exports = {
  getPackages,
  createPackage,
  deleteUserPackage,
  getAllPackages,
  getSinglePackage,
  editSinglePackage,
  deleteSinglePackage,
  deleteAllPackages,
};
