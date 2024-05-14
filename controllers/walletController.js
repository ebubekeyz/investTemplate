const Wallet = require('../models/Wallet');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const createWallet = async (req, res) => {
  req.body.user = req.user.userId;
  const wallet = await Wallet.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: wallet });
};

const getWallet = async (req, res) => {
  let { user, tron, bnb, btc, eth, usdt, sort } = req.query;

  let result = Wallet.find({});

  if (user) {
    result = Wallet.find({
      user: { $eq: user },
    });
  }

  if (tron) {
    result = Wallet.find({
      tron: { $regex: tron, $options: 'i' },
    });
  }

  if (bnb) {
    result = Wallet.find({
      bnb: { $regex: bnb, $options: 'i' },
    });
  }
  if (eth) {
    result = Wallet.find({
      eth: { $regex: eth, $options: 'i' },
    });
  }
  if (usdt) {
    result = Wallet.find({
      usdt: { $regex: usdt, $options: 'i' },
    });
  }
  if (btc) {
    result = Wallet.find({
      btc: { $regex: btc, $options: 'i' },
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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const wallet = await result;

  const totalWallet = await Wallet.countDocuments();
  const numOfPage = Math.ceil(totalWallet / limit);

  res.status(StatusCodes.OK).json({
    wallet: wallet,
    meta: {
      pagination: { page: page, total: totalWallet, pageCount: numOfPage },
    },
  });
};

const getSingleWallet = async (req, res) => {
  const { id: walletId } = req.params;
  const wallet = await Wallet.findOne({ _id: walletId });
  if (!wallet) {
    throw new BadRequestError(`Wallet with id ${walletId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ wallet: wallet });
};

const editSingleWallet = async (req, res) => {
  const { id: walletId } = req.params;
  const wallet = await Wallet.findOneAndUpdate({ _id: walletId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!wallet) {
    throw new BadRequestError(`Wallet with id ${walletId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ wallet: wallet });
};

const deleteSingleWallet = async (req, res) => {
  const { id: walletId } = req.params;
  const wallet = await Wallet.findByIdAndDelete({ _id: walletId });
  if (!wallet) {
    throw new BadRequestError(`Wallet with id ${walletId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Wallet Deleted' });
};

const deleteAllWallet = async (req, res) => {
  const wallet = await Wallet.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Wallet Deleted' });
};

const deleteUserWallet = async (req, res) => {
  const { id: userId } = req.params;
  const wallet = await Wallet.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Wallet successfully deleted' });
};

module.exports = {
  getWallet,
  createWallet,
  deleteUserWallet,
  getSingleWallet,
  editSingleWallet,
  deleteSingleWallet,
  deleteAllWallet,
};
