import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6"> Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { flag: '🇪🇸', language: 'Spanish' },
          { flag: '🇫🇷', language: 'French' },
          { flag: '🇩🇪', language: 'German' },
          { flag: '🇮🇹', language: 'Italian' },
          { flag: '🇭🇷', language: 'Croatian' },
          { flag: '🇯🇵', language: 'Japanese' },
          { flag: '🇰🇷', language: 'Korean' },
          { flag: '🇮🇳', language: 'Hindi' },
        ].map(({ flag, language }) => (
          <div
            key={language}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
          >
            <div className="text-4xl">{flag}</div>
            <div className="mt-4 text-lg font-semibold">{language}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
