"use client";

import React from 'react';
import Forms from '../components/FormsCreator';
import Header from '../components/Header';

const FormsPage: React.FC = () => {
  console.log("called form page")
  return (
    <div>
      <Header />
      <main>
        <Forms />
      </main>
    </div>
  );
};

export default FormsPage;