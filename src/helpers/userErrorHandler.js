const express = require("express");
// const User = require("../models/userModel");

//Handling errors
exports.handleErrors = (err) => {
  console.log(err.message, err.code);
  console.log(err);
  let errors = {
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    username: "",
    profileImage: "",
  };

  if (err.code === 11000) {
    errors.email = "The Email or Username is already registered";
    return errors;
  }

  // Incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "The email is not registered";
  }

  // Incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "The password is not registered";
  }

  //validate errors
  if (err.message.includes("user validation failed"))
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });

  return errors;
};
