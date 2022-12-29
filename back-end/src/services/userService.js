import bcrypt from "bcrypt";
import User from "../db/schemas/User.js";
import doten from "dotenv";
// import jwt from "jsonwebtoken";
doten.config();
let saltRounds = 10;

export function getUserservice(data) {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.find().populate([
        { path: "role" },
        { path: "position" },
        { path: "gender" },
      ]);
      resolve({ errCode: 0, users });
    } catch (e) {
      reject(e);
    }
  });
}

export function createUserService(data) {
  console.log("create user req.body: ", data);
  return new Promise(async (resolve, reject) => {
    if (
      !data.email ||
      !data.password ||
      !data.firstName ||
      !data.lastName ||
      !data.address ||
      !data.role
    ) {
      resolve({ errCode: 1, message: "Missing Parameter" });
    }
    try {
      let checkUser = await User.findOne({ email: data.email });
      if (!checkUser) {
        let password = hashPassword(data.password);
        let user = await User.create({
          email: data.email,
          password: password,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          address: data.address,
          phoneNumber: data.phoneNumber,
          role: data.role,
        });
        user.save().then(() => console.log("created a user, ", user));
        resolve({ errCode: 0, message: "Created user successful" });
      } else {
        resolve({ errCode: 2, message: "User already exist" });
      }
    } catch (e) {
      reject(e);
    }
  });
}

export function loginService(data) {
  console.log("login req.body --------------: ", data);
  return new Promise(async (resolve, reject) => {
    if (!data.email || !data.password) {
      resolve({ errCode: 1, message: "Missing Parameter" });
    }
    try {
      let user = await User.findOne({ email: data.email }, [
        "id",
        "password",
        "email",
        "role",
        "lastName",
      ]).populate([{ path: "role" }, { path: "position" }, { path: "gender" }]);
      if (!user) {
        resolve({ errCode: 2, message: "User not exist" });
      } else {
        if (bcrypt.compareSync(data.password, user.password)) {
          delete user._doc.password;
          resolve({
            errCode: 0,
            message: "Login Success",
            user: user,
          });
        } else {
          resolve({ errCode: 3, message: "Wrong password" });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
}

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
