const mongoose = require("mongoose");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true, 
  },
  
  lastname: {
      type: String,
      maxlength: 32,
      trim: true,
      required: true
  },
  
  email: {
      type: String,
      required: true,
      trim: true,
  },
  
  userInfo: {
      type: String,
      trim: true, 
  },
  
  encry_Password: {
      type: String,
      required: true,
      maxlength: 100,
  },

  oPassword:{
      type: String,
      maxlength: 100,
  },
  
  salt: String,

  role:{
      type: Number, 
      default: 0,
  },

  purchases:{
      type: Array,
      default:[],
  }

  }, {timestamps: true}
  );

// Encrypting Password

userSchema.virtual("password")
          .set(function(password){
            this._Password = password
            this.salt = uuidv4();
            this.oPassword = password;
            this.encry_Password = this.securePassword(password);
        })
          .get(function(){
            return this._Password
        })

userSchema.methods = {
    authenticate: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_Password;
    },

    securePassword: function(plainpassword){
          if(!plainpassword) return "";
          try {
              return crypto.createHmac('sha256', this.salt)
              .update(plainpassword)
              .digest('hex');
          } catch (err) {
              return "";
          }
      }
  }

  module.exports = mongoose.model("User", userSchema)