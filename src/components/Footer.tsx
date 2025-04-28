import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#3b83f6] to-[#0fb981] shadow-sm py-4 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-lg text-white">
          <div className="mb-2 sm:mb-0">
            © {new Date().getFullYear()} Payment Gateway Calculator
          </div>
          <div className="space-x-4">
            <span>
              Rates shown are approximate and may vary by provider
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;