// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  subscription: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  editorSettings: EditorSettings;
  notifications: NotificationSettings;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: string;
  wordWrap: boolean;
  autoSave: boolean;
  minimap: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  updates: boolean;
}

// Game Types
export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: GameCategory;
  tags: string[];
  isPublic: boolean;
  isPublished: boolean;
  userId: string;
  collaborators: Collaborator[];
  createdAt: string;
  updatedAt: string;
  stats: GameStats;
  metadata: GameMetadata;
  config: GameConfig;
}

export interface GameStats {
  views: number;
  downloads: number;
  likes: number;
  rating: number;
  reviewCount: number;
}

export interface GameMetadata {
  version: string;
  lastPlayedAt?: string;
  buildTime?: string;
  fileSize: number;
  platforms: Platform[];
}

export interface GameConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  scenes: Scene[];
  assets: Asset[];
  settings: GameSettings;
}

export interface GameSettings {
  width: number;
  height: number;
  backgroundColor: string;
  physics: boolean;
  sound: boolean;
  fullscreen: boolean;
  responsive: boolean;
}

export interface Collaborator {
  userId: string;
  username: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}

export type GameCategory = 
  | 'action'
  | 'adventure'
  | 'puzzle'
  | 'strategy'
  | 'simulation'
  | 'rpg'
  | 'casual'
  | 'educational'
  | 'other';

export type Platform = 
  | 'web'
  | 'android'
  | 'ios'
  | 'windows'
  | 'mac'
  | 'linux'
  | 'steam'
  | 'switch';

// Scene Types
export interface Scene {
  id: string;
  name: string;
  type: SceneType;
  config: SceneConfig;
  objects: GameObject[];
  scripts: Script[];
  background?: Background;
  camera: Camera;
  physics?: PhysicsConfig;
}

export type SceneType = 'game' | 'menu' | 'loading' | 'cutscene';

export interface SceneConfig {
  width: number;
  height: number;
  gravity: number;
  bounds: Bounds;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// GameObject Types
export interface GameObject {
  id: string;
  name: string;
  type: GameObjectType;
  transform: Transform;
  sprite?: Sprite;
  physics?: PhysicsBody;
  scripts: string[]; // Script IDs
  components: Component[];
  visible: boolean;
  layer: number;
  tags: string[];
}

export type GameObjectType = 
  | 'sprite'
  | 'text'
  | 'button'
  | 'tilemap'
  | 'particle'
  | 'sound'
  | 'group';

export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  originX: number;
  originY: number;
}

export interface Sprite {
  assetId: string;
  frame?: number;
  animations: Animation[];
  tint: string;
  alpha: number;
}

export interface Animation {
  name: string;
  frames: number[];
  frameRate: number;
  loop: boolean;
  yoyo: boolean;
}

export interface PhysicsBody {
  type: 'static' | 'dynamic' | 'kinematic';
  shape: 'rectangle' | 'circle' | 'polygon';
  mass: number;
  friction: number;
  bounce: number;
  sensor: boolean;
  collisionGroup: number;
  collidesWith: number[];
}

export interface PhysicsConfig {
  gravity: { x: number; y: number };
  bounds: Bounds;
  debug: boolean;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
  followTarget?: string; // GameObject ID
  bounds?: Bounds;
}

export interface Background {
  type: 'color' | 'image' | 'parallax';
  value: string | ParallaxBackground;
}

export interface ParallaxBackground {
  layers: ParallaxLayer[];
}

export interface ParallaxLayer {
  assetId: string;
  scrollX: number;
  scrollY: number;
  repeat: boolean;
}

// Component Types
export interface Component {
  id: string;
  type: ComponentType;
  enabled: boolean;
  properties: Record<string, any>;
}

export type ComponentType = 
  | 'movement'
  | 'collision'
  | 'audio'
  | 'animation'
  | 'ui'
  | 'particle'
  | 'input'
  | 'custom';

// Asset Types
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  metadata: AssetMetadata;
  tags: string[];
  createdAt: string;
  fileSize: number;
}

export type AssetType = 
  | 'image'
  | 'sprite'
  | 'audio'
  | 'video'
  | 'font'
  | 'json'
  | 'tilemap'
  | 'shader';

export interface AssetMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format: string;
  frames?: number;
  fps?: number;
}

// Script Types
export interface Script {
  id: string;
  name: string;
  type: ScriptType;
  language: 'javascript' | 'typescript' | 'visual';
  code: string;
  visualBlocks?: VisualBlock[];
  enabled: boolean;
  events: ScriptEvent[];
}

export type ScriptType = 'behavior' | 'system' | 'ui' | 'utility';

export interface ScriptEvent {
  type: EventType;
  conditions: Condition[];
  actions: Action[];
}

export type EventType = 
  | 'start'
  | 'update'
  | 'collision'
  | 'input'
  | 'custom';

export interface Condition {
  type: string;
  parameters: Record<string, any>;
}

export interface Action {
  type: string;
  parameters: Record<string, any>;
}

export interface VisualBlock {
  id: string;
  type: BlockType;
  position: { x: number; y: number };
  connections: Connection[];
  parameters: Record<string, any>;
}

export type BlockType = 
  | 'event'
  | 'condition'
  | 'action'
  | 'variable'
  | 'function'
  | 'loop'
  | 'math'
  | 'logic';

export interface Connection {
  from: string;
  to: string;
  type: 'execution' | 'data';
}

// AI Types
export interface AIRequest {
  type: AIRequestType;
  prompt: string;
  context?: Record<string, any>;
  options?: AIRequestOptions;
}

export type AIRequestType = 
  | 'code-generation'
  | 'sprite-generation'
  | 'music-generation'
  | 'story-generation'
  | 'optimization'
  | 'debugging';

export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  gameContext?: Game;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Export Types
export interface ExportConfig {
  platform: Platform;
  optimization: 'development' | 'production';
  compression: boolean;
  minification: boolean;
  bundling: boolean;
  customSettings?: Record<string, any>;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
  logs: string[];
  size: number;
  buildTime: number;
}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: MarketplaceItemType;
  category: string;
  price: number;
  currency: string;
  sellerId: string;
  sellerName: string;
  thumbnail: string;
  screenshots: string[];
  rating: number;
  reviewCount: number;
  downloads: number;
  tags: string[];
  license: string;
  createdAt: string;
  updatedAt: string;
}

export type MarketplaceItemType = 
  | 'game'
  | 'template'
  | 'asset'
  | 'script'
  | 'plugin'
  | 'tutorial';

// Analytics Types
export interface Analytics {
  totalGames: number;
  totalUsers: number;
  activeUsers: number;
  gamesCreated: number;
  gamesPublished: number;
  revenue: number;
  platformStats: PlatformStats[];
  userActivity: UserActivity[];
}

export interface PlatformStats {
  platform: Platform;
  games: number;
  downloads: number;
  revenue: number;
}

export interface UserActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
  gamesCreated: number;
}

// Legal & Compliance Types
export interface LegalCheck {
  id: string;
  type: LegalCheckType;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  results: LegalCheckResult[];
  createdAt: string;
  completedAt?: string;
}

export type LegalCheckType = 
  | 'copyright'
  | 'patent'
  | 'trademark'
  | 'content-moderation'
  | 'license-compliance';

export interface LegalCheckResult {
  type: LegalCheckType;
  passed: boolean;
  confidence: number;
  issues: LegalIssue[];
  recommendations: string[];
}

export interface LegalIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion: string;
  reference?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface GameCreateForm {
  title: string;
  description: string;
  category: GameCategory;
  template?: string;
  isPublic: boolean;
}

export interface UserProfile {
  fullName: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: File;
}

// Store Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface GameState {
  games: Game[];
  currentGame: Game | null;
  isLoading: boolean;
  fetchGames: () => Promise<void>;
  createGame: (data: GameCreateForm) => Promise<void>;
  updateGame: (id: string, data: Partial<Game>) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  setCurrentGame: (game: Game | null) => void;
}

export interface EditorState {
  selectedObjects: GameObject[];
  selectedTool: EditorTool;
  isPlaying: boolean;
  zoom: number;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
  history: EditorAction[];
  historyIndex: number;
  clipboard: GameObject[];
}

export type EditorTool = 
  | 'select'
  | 'move'
  | 'rotate'
  | 'scale'
  | 'brush'
  | 'eraser'
  | 'text'
  | 'shape';

export interface EditorAction {
  type: 'create' | 'delete' | 'modify' | 'move';
  objectId: string;
  before?: any;
  after?: any;
  timestamp: number;
}