import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  owner: mongoose.Types.ObjectId;
  collaborators: {
    user: mongoose.Types.ObjectId;
    role: 'viewer' | 'editor' | 'admin';
    permissions: string[];
  }[];
  gameData: {
    genre: string;
    platform: string[];
    targetAudience: string;
    gameMode: 'single' | 'multiplayer' | 'both';
    estimatedPlayTime: number;
  };
  codeFiles: {
    filename: string;
    language: string;
    content: string;
    lastModified: Date;
    modifiedBy: mongoose.Types.ObjectId;
  }[];
  assets: {
    id: string;
    name: string;
    type: 'image' | 'audio' | 'video' | 'model' | 'texture' | 'script';
    url: string;
    size: number;
    metadata: any;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
  }[];
  scenes: {
    id: string;
    name: string;
    objects: any[];
    camera: any;
    lighting: any;
    physics: any;
  }[];
  settings: {
    resolution: {
      width: number;
      height: number;
    };
    frameRate: number;
    graphics: {
      quality: 'low' | 'medium' | 'high' | 'ultra';
      antiAliasing: boolean;
      shadows: boolean;
      reflections: boolean;
    };
    audio: {
      masterVolume: number;
      musicVolume: number;
      sfxVolume: number;
      spatialAudio: boolean;
    };
    controls: {
      keyboard: any;
      mouse: any;
      gamepad: any;
      touch: any;
    };
  };
  buildSettings: {
    platforms: string[];
    optimization: 'debug' | 'release';
    compression: boolean;
    minification: boolean;
    bundling: boolean;
  };
  analytics: {
    views: number;
    downloads: number;
    likes: number;
    forks: number;
    playTime: number;
    ratings: {
      average: number;
      count: number;
      distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
      };
    };
  };
  publishing: {
    isPublished: boolean;
    publishedAt?: Date;
    version: string;
    changelog: string;
    license: string;
    price: number;
    platforms: {
      name: string;
      url?: string;
      status: 'pending' | 'approved' | 'rejected' | 'published';
    }[];
  };
  monetization: {
    model: 'free' | 'paid' | 'freemium' | 'subscription';
    price: number;
    inAppPurchases: boolean;
    advertisements: boolean;
    revenue: {
      total: number;
      monthly: { month: string; amount: number }[];
    };
  };
  legal: {
    copyrightChecked: boolean;
    patentChecked: boolean;
    trademarkChecked: boolean;
    contentRating: string;
    ageRating: string;
    warnings: string[];
    approvals: {
      content: boolean;
      legal: boolean;
      technical: boolean;
    };
  };
  ai: {
    generatedAssets: number;
    generatedCode: number;
    optimizations: number;
    suggestions: {
      id: string;
      type: string;
      message: string;
      applied: boolean;
      createdAt: Date;
    }[];
  };
  version: {
    major: number;
    minor: number;
    patch: number;
    build: number;
  };
  isPublic: boolean;
  isFeatured: boolean;
  isTemplate: boolean;
  templateCategory?: string;
  lastModified: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['action', 'adventure', 'puzzle', 'strategy', 'rpg', 'simulation', 'sports', 'racing', 'educational', 'casual', 'other']
  },
  tags: [{
    type: String,
    maxlength: 30
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    permissions: [String]
  }],
  gameData: {
    genre: String,
    platform: [{
      type: String,
      enum: ['web', 'mobile', 'desktop', 'console']
    }],
    targetAudience: {
      type: String,
      enum: ['children', 'teens', 'adults', 'all']
    },
    gameMode: {
      type: String,
      enum: ['single', 'multiplayer', 'both']
    },
    estimatedPlayTime: Number
  },
  codeFiles: [{
    filename: String,
    language: {
      type: String,
      enum: ['javascript', 'typescript', 'python', 'csharp', 'lua']
    },
    content: String,
    lastModified: Date,
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  assets: [{
    id: String,
    name: String,
    type: {
      type: String,
      enum: ['image', 'audio', 'video', 'model', 'texture', 'script']
    },
    url: String,
    size: Number,
    metadata: Schema.Types.Mixed,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  scenes: [{
    id: String,
    name: String,
    objects: [Schema.Types.Mixed],
    camera: Schema.Types.Mixed,
    lighting: Schema.Types.Mixed,
    physics: Schema.Types.Mixed
  }],
  settings: {
    resolution: {
      width: {
        type: Number,
        default: 1920
      },
      height: {
        type: Number,
        default: 1080
      }
    },
    frameRate: {
      type: Number,
      default: 60
    },
    graphics: {
      quality: {
        type: String,
        enum: ['low', 'medium', 'high', 'ultra'],
        default: 'medium'
      },
      antiAliasing: {
        type: Boolean,
        default: true
      },
      shadows: {
        type: Boolean,
        default: true
      },
      reflections: {
        type: Boolean,
        default: false
      }
    },
    audio: {
      masterVolume: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
      },
      musicVolume: {
        type: Number,
        default: 80,
        min: 0,
        max: 100
      },
      sfxVolume: {
        type: Number,
        default: 90,
        min: 0,
        max: 100
      },
      spatialAudio: {
        type: Boolean,
        default: true
      }
    },
    controls: {
      keyboard: Schema.Types.Mixed,
      mouse: Schema.Types.Mixed,
      gamepad: Schema.Types.Mixed,
      touch: Schema.Types.Mixed
    }
  },
  buildSettings: {
    platforms: [{
      type: String,
      enum: ['web', 'android', 'ios', 'windows', 'mac', 'linux', 'switch', 'playstation', 'xbox']
    }],
    optimization: {
      type: String,
      enum: ['debug', 'release'],
      default: 'debug'
    },
    compression: {
      type: Boolean,
      default: true
    },
    minification: {
      type: Boolean,
      default: true
    },
    bundling: {
      type: Boolean,
      default: true
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    forks: {
      type: Number,
      default: 0
    },
    playTime: {
      type: Number,
      default: 0
    },
    ratings: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 }
      }
    }
  },
  publishing: {
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: Date,
    version: {
      type: String,
      default: '1.0.0'
    },
    changelog: String,
    license: {
      type: String,
      default: 'MIT'
    },
    price: {
      type: Number,
      default: 0
    },
    platforms: [{
      name: String,
      url: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'published'],
        default: 'pending'
      }
    }]
  },
  monetization: {
    model: {
      type: String,
      enum: ['free', 'paid', 'freemium', 'subscription'],
      default: 'free'
    },
    price: {
      type: Number,
      default: 0
    },
    inAppPurchases: {
      type: Boolean,
      default: false
    },
    advertisements: {
      type: Boolean,
      default: false
    },
    revenue: {
      total: {
        type: Number,
        default: 0
      },
      monthly: [{
        month: String,
        amount: Number
      }]
    }
  },
  legal: {
    copyrightChecked: {
      type: Boolean,
      default: false
    },
    patentChecked: {
      type: Boolean,
      default: false
    },
    trademarkChecked: {
      type: Boolean,
      default: false
    },
    contentRating: String,
    ageRating: String,
    warnings: [String],
    approvals: {
      content: {
        type: Boolean,
        default: false
      },
      legal: {
        type: Boolean,
        default: false
      },
      technical: {
        type: Boolean,
        default: false
      }
    }
  },
  ai: {
    generatedAssets: {
      type: Number,
      default: 0
    },
    generatedCode: {
      type: Number,
      default: 0
    },
    optimizations: {
      type: Number,
      default: 0
    },
    suggestions: [{
      id: String,
      type: String,
      message: String,
      applied: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  version: {
    major: {
      type: Number,
      default: 1
    },
    minor: {
      type: Number,
      default: 0
    },
    patch: {
      type: Number,
      default: 0
    },
    build: {
      type: Number,
      default: 0
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateCategory: String,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ isPublic: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ 'publishing.isPublished': 1 });
ProjectSchema.index({ lastModified: -1 });

export default mongoose.model<IProject>('Project', ProjectSchema);