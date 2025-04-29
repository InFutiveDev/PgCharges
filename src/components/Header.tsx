import React from 'react';
import { IndianRupee } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-[#2b4be3] to-[#1c36b2] shadow-sm">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-600">
              <IndianRupee size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">PG Charges Calculator</h1>
              <p className="text-sm text-white/80">For Indian Merchants</p>
            </div>
          </div>
          
          <div className="hidden sm:block">
            <span className="text-lg text-white/90">
              Get instant fee estimates with our easy PG calculator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;