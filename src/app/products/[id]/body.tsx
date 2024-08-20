import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Preloader from '@/components/preloader/preloader';
import Slider from "react-slick";

// Import slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
    productmasterid: number;
    name: string;
    code: string;
    brandName: string;
    price: string;
    availability: string;
    description: string;
    imageUrls: string[];
    quantity: number;
    colorName: string;
    hexcode: string;
    sizeName: string;
}

// Custom arrow component for slick slider
const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full cursor-pointer z-10"
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </div>
    );
};

const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full cursor-pointer z-10"
            onClick={onClick}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </div>
    );
};

const Body: React.FC = () => {
    const { authState } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/product-details?id=${id}`)
                .then((response) => {
                    if (response.data) {
                        setProduct(response.data);
                    } else {
                        setError("Product not found");
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return <div><Preloader /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No product found.</div>;
    }

    const updatePageRedirection = () => {
        if (id) {
            router.push(`/update-page/${id}`);
        } else {
            console.error("Product Master ID is undefined");
        }
    };

    const handleDeleteProduct = async () => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await axios.delete('/api/products', {
                    data: {
                        productmasterid: product?.productmasterid,
                        deletedby: authState.user?.userid
                    }
                });

                if (response.status === 200) {
                    alert('Product deleted successfully.');
                    router.push('/dashboard');
                } else {
                    alert(`Failed to delete product: ${response.data.message}`);
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('An error occurred while deleting the product.');
            }
        }
    };

    // Carousel settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <main className="py-8 mx-10 w-full px-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-2 py-8">
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        <div className="max-h-[400px] h-full rounded-lg  mb-4 relative overflow-hidden max-w-[500px]">
                            <Slider {...settings}>
                                {product.imageUrls.map((url, index) => (
                                    <div key={index} className="flex justify-center items-center">
                                        <img
                                            src={url}
                                            className="object-contain max-h-[400px] w-[500px]"
                                            alt={`Product Image ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                    <div className="md:flex-1 px-4">
                        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            {product.code}
                        </p>
                        <div className="flex mb-4">
                            <div className="mr-4">
                                <span className="font-bold text-gray-700">Price:</span>
                                <span className="text-gray-600 ml-2">BDT {product.price}৳</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-700">Availability:</span>
                                <span className="text-gray-600 ml-2">{product.quantity}</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-700 ml-5">Brand:</span>
                                <span className="text-gray-600 ml-2">{product.brandName}</span>
                            </div>
                        </div>
                        <div className="mb-4 flex">
                            <span className="font-bold text-gray-700">Color:</span>
                            <div>
                                <h3 className="text-gray-600 ml-2">{product.colorName}</h3>
                                <svg width="30px" height="40px" viewBox="0 -2 24 24" id="meteor-icon-kit__solid-tshirt" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.00009 9.3873L3.31634 9.9485C2.7924 10.1232 2.22609 9.84 2.05144 9.3161L0.0514698 3.31616C-0.105899 2.84405 0.107827 2.32807 0.552933 2.10552L4.55288 0.10555C4.69174 0.03612 4.84485 -0.00003 5.00009 -0.00003H8.00005C8.31481 -0.00003 8.61119 0.14817 8.80004 0.39997C9.61118 1.48148 10.6481 1.99995 12 1.99995C13.3519 1.99995 14.3888 1.48148 15.2 0.39997C15.3888 0.14817 15.6852 -0.00003 16 -0.00003H18.9999C19.1552 -0.00003 19.3083 0.03612 19.4471 0.10555L23.4471 2.10552C23.8922 2.32807 24.1059 2.84405 23.9485 3.31616L21.9486 9.3161C21.7739 9.84 21.2076 10.1232 20.6837 9.9485L18.9999 9.3873V18.9997C18.9999 19.552 18.5522 19.9997 17.9999 19.9997H6.00008C5.4478 19.9997 5.00009 19.552 5.00009 18.9997V9.3873z" fill={product.hexcode} />
                                </svg>
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="font-bold text-gray-700">Size:</span>
                            <div className="flex items-center mt-2">
                                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400">{product.sizeName}</button>
                            </div>
                        </div>
                        <div>
                            <span className="font-bold text-gray-700">Product Description:</span>
                            <p className="text-gray-600 text-sm mt-2">
                                {product.description}
                            </p>
                        </div>
                        <div>
                                <span className="font-bold text-gray-700">Select Quantity:</span>
                                <input
                                    type="number"
                                    className="h-10 w-20 border rounded-lg text-center mt-2"
                                    max={product.quantity}
                                    min={1}
                                    defaultValue={1}
                                />
                            </div>
                        {authState.isAuthenticated && (
                            <div className="mt-4">
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-full font-bold hover:bg-blue-600"
                                    onClick={updatePageRedirection}
                                >
                                    Add to cart
                                </button>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Body;
