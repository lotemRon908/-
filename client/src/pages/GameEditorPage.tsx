import React from 'react';
import { Helmet } from 'react-helmet-async';
import AIGameGenerator from '../components/GameGeneration/AIGameGenerator';

const GameEditorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>עורך המשחקים - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="h-full">
        <AIGameGenerator />
      </div>
    </>
  );
};

export default GameEditorPage;