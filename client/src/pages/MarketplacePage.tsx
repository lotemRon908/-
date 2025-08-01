import React from 'react';
import { Helmet } from 'react-helmet-async';

const MarketplacePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>שוק הנכסים - GameCraft Pro Ultimate</title>
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-secondary-900">שוק הנכסים</h1>
        <div className="card p-6">
          <p className="text-secondary-600">בקרוב - שוק נכסים ותבניות משחקים</p>
        </div>
      </div>
    </>
  );
};

export default MarketplacePage;