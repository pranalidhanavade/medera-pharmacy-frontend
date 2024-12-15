// components/PharmaNavbar.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // For adding the logo

const PharmaNavbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-auto mx-auto flex justify-between items-center px-4">
        {/* Logo Section */}
        <div className="flex items-center ml-12">
          <Image
            src="/medera_logo_transparent.png"
            alt="Pharma Project Logo"
            width={140}
            height={140}
            className="rounded-full"
          />
        </div>

        <div className="flex-shrink-0">
          <Link href="/" className="text-sky-800 text-2xl font-bold mr-12">
          medera pharmacy dashboard
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button className="text-white">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PharmaNavbar;
