import React from 'react';
import Header from './components/Header';
import Calculator from './components/Calculator';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Calculator />
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
}

export default App;