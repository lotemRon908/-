const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a full name'],
    maxlength: [100, 'Full name cannot be more than 100 characters']
  },
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    maxlength: [50, 'Username cannot be more than 50 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and dashes']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    default: null
  },
  lastSensitiveOperation: {
    type: Date,
    default: null
  },
  preferences: {
    language: {
      type: String,
      default: 'he'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    editorSettings: {
      fontSize: {
        type: Number,
        default: 14
      },
      tabSize: {
        type: Number,
        default: 2
      },
      theme: {
        type: String,
        default: 'vs-dark'
      },
      wordWrap: {
        type: Boolean,
        default: true
      },
      autoSave: {
        type: Boolean,
        default: true
      },
      minimap: {
        type: Boolean,
        default: true
      }
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      },
      updates: {
        type: Boolean,
        default: true
      }
    }
  },
  profile: {
    bio: String,
    website: String,
    location: String,
    socialLinks: {
      twitter: String,
      github: String,
      linkedin: String,
      youtube: String
    }
  },
  stats: {
    gamesCreated: {
      type: Number,
      default: 0
    },
    gamesPublished: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    totalDownloads: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  apiKeys: [{
    name: String,
    key: String,
    permissions: [String],
    lastUsed: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  loginHistory: [{
    ip: String,
    userAgent: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's games
UserSchema.virtual('games', {
  ref: 'Game',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

// Virtual for user's assets
UserSchema.virtual('assets', {
  ref: 'Asset',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = require('crypto').randomBytes(20).toString('hex');

  this.emailVerificationToken = require('crypto')
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Update user stats
UserSchema.methods.updateStats = async function(statType, increment = 1) {
  if (this.stats[statType] !== undefined) {
    this.stats[statType] += increment;
    await this.save();
  }
};

// Check if user has permission
UserSchema.methods.hasPermission = function(permission) {
  const rolePermissions = {
    user: ['read:own', 'write:own', 'delete:own'],
    moderator: ['read:own', 'write:own', 'delete:own', 'moderate:content'],
    admin: ['read:all', 'write:all', 'delete:all', 'admin:system']
  };

  const userPermissions = rolePermissions[this.role] || [];
  return userPermissions.includes(permission);
};

// Add login history entry
UserSchema.methods.addLoginHistory = function(ip, userAgent, location) {
  this.loginHistory.unshift({
    ip,
    userAgent,
    location,
    timestamp: new Date()
  });

  // Keep only last 10 login entries
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(0, 10);
  }

  this.lastLogin = new Date();
};

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ subscription: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);