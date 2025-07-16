import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-600 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">🍽️One4U</h2>
          <p>Your go-to destination for delicious and fresh food delivered to your doorstep.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="hover:underline">Home</a></li>
            <li><a href="#menu" className="hover:underline">Menu</a></li>
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p>Email: support@one4u.com</p>
          <p>Phone: +91 XXXX XXXX XX</p>
          <p>Address: 123 Food Lane, Delicious City, India</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-700 text-center py-4">
        <p className="text-sm">&copy; {new Date().getFullYear()}One4U. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
