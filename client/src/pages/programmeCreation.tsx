"use client";

import React from 'react';
import Programme from '../components/ProgrammeCreator';
import Header from '../components/Header';

const ProgrammePage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Programme />
      </main>
    </div>
  );
};

export default ProgrammePage;