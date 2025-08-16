import React, { useState, useRef } from 'react';
import { 
  Wand2, 
  Save, 
  Download, 
  Play, 
  Loader2, 
  Sparkles, 
  GamepadIcon,
  Image
} from 'lucide-react';
import { generateGame } from '../../services/aiService';

interface GameData {
  title: string;
  hero: string;
  map: string[];
  sprite: string | null;
}

const AIGameGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewFrameRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('אנא הכנס רעיון למשחק!');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const newGameData = await generateGame(prompt);
      setGameData(newGameData);
      localStorage.setItem('currentGame', JSON.stringify(newGameData));
      reloadPreview();
    } catch (err) {
      setError('שגיאה ביצירת המשחק. נסה שוב.');
      console.error('Game generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (gameData) {
      const savedGames = JSON.parse(localStorage.getItem('savedGames') || '[]');
      const gameWithId = { ...gameData, id: Date.now().toString() };
      savedGames.push(gameWithId);
      localStorage.setItem('savedGames', JSON.stringify(savedGames));
      alert('המשחק נשמר בהצלחה!');
    }
  };

  const handleDownload = () => {
    if (gameData) {
      const dataStr = JSON.stringify(gameData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${gameData.title.replace(/\s+/g, '_')}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const reloadPreview = () => {
    if (previewFrameRef.current) {
      previewFrameRef.current.contentWindow?.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Game Generation Panel */}
      <div className="lg:w-1/2 space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-bold text-secondary-900">יוצר משחקים בינה מלאכותית</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-secondary-700 mb-2">
                תאר את המשחק שברצונך ליצור
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="לדוגמה: משחק פלטפורמה עם אביר שצריך לאסוף מטבעות ולהימנע ממפלצות..."
                className="w-full h-32 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={isGenerating}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  יוצר משחק...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  צור משחק
                </>
              )}
            </button>
          </div>
        </div>

        {/* Game Data Display */}
        {gameData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <GamepadIcon className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-bold text-secondary-900">פרטי המשחק</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-600">שם המשחק</label>
                <p className="text-lg font-semibold text-secondary-900">{gameData.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-600">דמות ראשית</label>
                <p className="text-2xl">{gameData.hero}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-600">מפה</label>
                <div className="bg-secondary-50 p-3 rounded-md font-mono text-sm">
                  {gameData.map.map((row, index) => (
                    <div key={index}>{row}</div>
                  ))}
                </div>
              </div>

              {gameData.sprite && (
                <div>
                  <label className="block text-sm font-medium text-secondary-600 mb-2">
                    <Image className="inline h-4 w-4 mr-1" />
                    ספרייט שנוצר
                  </label>
                  <img 
                    src={gameData.sprite} 
                    alt="Generated sprite" 
                    className="w-16 h-16 border rounded-md"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  שמור
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  הורד
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Preview Panel */}
      <div className="lg:w-1/2">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <Play className="h-6 w-6 text-primary-500" />
            <h3 className="text-lg font-bold text-secondary-900">תצוגה מקדימה</h3>
          </div>
          
          <div className="h-96 bg-secondary-50 rounded-md border-2 border-dashed border-secondary-300 flex items-center justify-center">
            {gameData ? (
              <iframe
                ref={previewFrameRef}
                src="/game-preview.html"
                className="w-full h-full rounded-md"
                title="Game Preview"
              />
            ) : (
              <div className="text-center text-secondary-500">
                <GamepadIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>המשחק יופיע כאן לאחר היצירה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGameGenerator;