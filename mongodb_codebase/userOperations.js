const User = require("./userModel");
const mongoose = require("mongoose");

async function createUser(name, email, age) {
  const user = new User({ name, email, age });
  await user.save();
  console.log("User created:", user);
}

async function getUsers() {
  const users = await User.find();
  console.log("Users:", users);
}

async function updateUser(email, newData) {
  const user = await User.findOneAndUpdate({ email }, newData, { new: true });
  console.log("Updated User:", user);
}

async function deleteUser(email) {
  await User.findOneAndDelete({ email });
  console.log("User deleted");
}

async function countUsersByAge() {
  const result = await User.aggregate([
    { $group: { _id: "$age", count: { $sum: 1 } } }
  ]);
  console.log("Users Count by Age:", result);
}

async function createIndex() {
  await User.collection.createIndex({ email: 1 });
  console.log("Index created on email field");
}

async function transactionExample() {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await User.create([{ name: "Alice", email: "alice@example.com", age: 30 }], { session });
    await User.create([{ name: "Bob", email: "bob@example.com", age: 28 }], { session });
    await session.commitTransaction();
    console.log("Transaction committed successfully");
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted", error);
  } finally {
    session.endSession();
  }
}

module.exports = { createUser, getUsers, updateUser, deleteUser, countUsersByAge, createIndex, transactionExample };
