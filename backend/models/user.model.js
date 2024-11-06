// import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 	},
// 	image: {
// 		type: String,
// 		default: "",
// 	},
// 	searchHistory: {
// 		type: Array,
// 		default: [],
// 	},
// });

// export const User = mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  searchHistory: {
    type: Array,
    default: [],
  },
  verificationToken: {
    type: String, // Field to store the email verification token
    default: "", // Default is empty string
  },
  isVerified: {
    type: Boolean, // Field to track if the email is verified
    default: false, // Default is false until verified
  },
});

export const User = mongoose.model("User", userSchema);
