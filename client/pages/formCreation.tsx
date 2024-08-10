"use client";

import React from 'react';
import Form from '../components/Form';
import Header from '../components/Header';

const FormPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <FormCreation />
      </main>
    </div>
  );
};

export default FormPage;