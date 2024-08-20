"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../app/context/auth-context';
import Marquee from 'react-fast-marquee';
import Router, { useRouter } from 'next/navigation';

const Navbar = () => {
  const { authState, logout } = useAuth();
  const router = useRouter();

  // Mock state for cart items count, replace this with your actual cart context or state
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleCartBtn = () =>{
    router.push(`/cart/${authState.user?.userid}`)
  }
  
  useEffect(() => {
    
    setCartItemCount(3); // Replace this with actual logic
  }, []);

  return (
    <div className="w-full shadow-md">
      <div className="mx-auto max-w-full">
        <nav className="bg-white">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/">
                <Image
                  src="/images/Logo/png/logo-no-background.png"
                  alt="FabricShop"
                  width={100}
                  height={40}
                  className="w-25 h-10 ml-20"
                  priority
                />
              </a>
            </div>

            {/* Navigation links or Search bar */}
            {authState.isAuthenticated ? (
              // Marquee
              <div className="flex-1 max-w-xl h-10 py-auto items-center">
                <Marquee>
                  <span className="inline-flex items-center px-4 text-base font-medium text-gray-900">
                    For any queries please contact:
                    <span className="inline-flex items-center px-4 py-2 text-base font-medium text-gray-900">
                      fabricshop@gmail.com &nbsp;&nbsp;
                    </span>
                  </span>
                </Marquee>
              </div>
            ) : (
              // Navigation links
              <div className="flex-1 flex justify-center">
                <ul className="flex space-x-8">
                  <li>
                    <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            )}

            {/* Sign in button or username */}
            <div className="flex items-center space-x-4">
              {authState.isAuthenticated ? (
                <>
                  <span className="inline-flex items-center px-4 py-2 text-base font-medium text-gray-900">
                    {authState.user?.username}
                    <img 
                      src={authState.user?.image || '/path/to/default/avatar.png'} 
                      alt={`${authState.user?.username}'s avatar`} 
                      className="ml-2 h-8 w-8 rounded-full"
                    />
                  </span>
                  <div className="relative">
                    <button onClick={handleCartBtn}>
                      <img src="../images/shopping-cart.png" alt="cart" height={20} width={35} />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-red-500 "
                  >
                    Logout <img src="../svg/logout.svg" alt="" height={25} width={25} className="ml-2" />
                  </button>
                </>
              ) : (
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800"
                >
                  Sign in
                </a>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
