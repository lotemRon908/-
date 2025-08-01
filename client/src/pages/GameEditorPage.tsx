import React from 'react';
import { Helmet } from 'react-helmet-async';

const GameEditorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>עורך המשחקים - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">עורך המשחקים</h1>
          <p className="text-secondary-600">בקרוב - עורך ויזואלי מתקדם עם AI</p>
        </div>
      </div>
    </>
  );
};

export default GameEditorPage;