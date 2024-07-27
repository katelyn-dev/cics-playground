import React from 'react';
import Form from '../component/Form';
import Header from '../component/Header';

const FormPage: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Form />
      </main>
    </div>
  );
};

export default FormPage;