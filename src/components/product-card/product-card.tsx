import React from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/context/auth-context"; // Adjust the path as needed
import axios from 'axios';

const ProductCard = ({ product }: { product: any }) => {
  const { authState } = useAuth(); // Get the auth state
  const { Name, Quantity, Size, Description, Price, BrandName, ImageUrl, ProductMasterId } = product;
  const imageUrl = ImageUrl.length > 0 ? ImageUrl[0] : '../images/Image_not_available.png';

  // Determine availability based on quantity
  const isAvailable = Quantity > 0;

  const router = useRouter();

  const handleViewBtn = () => {
    if (!authState.isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }
    // Replace with correct path format
    router.push(`/products/${ProductMasterId}`);
  };

  // const handleDeleteProduct = async () => {
  //   if (confirm('Are you sure you want to delete this product?')) {
  //     try {
  //       const response = await axios.delete('/api/products', {
  //         data: {
  //           productmasterid: ProductMasterId,
  //           deletedby: authState.user?.userid
  //         }
  //       });

  //       if (response.status === 200) {
  //         alert('Product deleted successfully.');
  //         router.push('/dashboard'); // Redirect to dashboard after successful deletion
  //       } else {
  //         alert(`Failed to delete product: ${response.data.message}`);
  //       }
  //     } catch (error) {
  //       console.error('Error deleting product:', error);
  //       alert('An error occurred while deleting the product.');
  //     }
  //   }
  // };

  return (
    <div className="w-full sm:w-48 md:w-56 bg-white mb-4 mt-2 mx-auto shadow-lg rounded-lg overflow-hidden">
      <div
        className="h-24 sm:h-36 w-full bg-gray-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="flex justify-between p-2">
          <span className={`uppercase text-xs p-1 border rounded font-medium select-none ${isAvailable ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col items-center">
        <p className="text-gray-400 font-light text-xs text-center">Brand: {BrandName || 'N/A'}</p>
        <h1 className="text-gray-800 text-center mt-1 text-md font-semibold">{Name || 'Product Name'}</h1>
        {/* product size */}
        {/* <p className="text-gray-800 font-light text-s text-center">Size: {Size || 'N/A'}</p> */}
        
        <p className="text-center text-gray-800 mt-1 font-medium">Tk. {Price || '0'}</p>
        <div className="inline-flex items-center mt-2">
          <div className={`bg-gray-100 border border-gray-300 text-gray-600 px-4 py-1 rounded ${isAvailable ? '' : 'bg-red-50 text-red-700'}`}>
            {isAvailable ? `In Stock: ${Quantity}` : 'Out of Stock'}
          </div>
        </div>
        <button
          className={`py-2 px-2 bg-blue-500 text-sm text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center ${!isAvailable ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={!isAvailable}
          onClick={handleViewBtn}
        >
          View Product
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        {/* {authState.isAuthenticated && (
          <button
            className="py-2 px-2 bg-red-500 text-sm text-white rounded hover:bg-red-600 active:bg-red-700 mt-2 w-full flex items-center justify-center"
            onClick={handleDeleteProduct}
          >
            Delete Product
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )} */}
      </div>
    </div>
  );
};

export default ProductCard;
