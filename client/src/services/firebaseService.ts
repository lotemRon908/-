// Placeholder for Firebase integration
// Use only when ready to add auth + cloud saves

export function initFirebase(): void {
  console.log("Firebase not yet configured.");
}

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export class FirebaseService {
  private initialized = false;

  async initialize(config?: FirebaseConfig): Promise<void> {
    if (this.initialized) {
      console.log("Firebase already initialized.");
      return;
    }

    // TODO: Add Firebase SDK initialization here
    console.log("Firebase initialization placeholder", config);
    this.initialized = true;
  }

  async saveGame(gameData: any): Promise<string> {
    console.log("Firebase save game placeholder", gameData);
    return "placeholder-game-id";
  }

  async loadGame(gameId: string): Promise<any> {
    console.log("Firebase load game placeholder", gameId);
    return null;
  }

  async getUserGames(userId: string): Promise<any[]> {
    console.log("Firebase get user games placeholder", userId);
    return [];
  }
}

export const firebaseService = new FirebaseService();