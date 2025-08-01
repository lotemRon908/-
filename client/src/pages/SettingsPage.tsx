import React from 'react';
import { Helmet } from 'react-helmet-async';

const SettingsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>הגדרות - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-secondary-900">הגדרות</h1>
        <div className="card p-6">
          <p className="text-secondary-600">בקרוב - הגדרות מתקדמות למשתמש</p>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;