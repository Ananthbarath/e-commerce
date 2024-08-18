import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Tooltip } from 'react-tooltip';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Function to apply a discount based on the discount percentage
  const applyDiscount = (price) => {
    return (price * (1 - discountPercentage / 100)).toFixed(2);
  };

  // Calculate the total price without discounts
  const getTotalPrice = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
  };

  // Calculate the total price with discounts applied
  const getDiscountedTotalPrice = () => {
    return cart.reduce((total, product) => total + applyDiscount(product.price) * product.quantity, 0).toFixed(2);
  };

  // Calculate the total discount applied
  const getTotalDiscount = () => {
    return (getTotalPrice() - getDiscountedTotalPrice()).toFixed(2);
  };

  // Handle quantity change with validation
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) {
      setQuantityError('Invalid quantity. Please enter a positive number.');
      return;
    }
    setQuantityError('');
    updateQuantity(productId, newQuantity);
  };

  // Handle discount code application
  const handleApplyDiscount = () => {
    const validCodes = {
      DISCOUNT10: 10,
      SALE20: 20,
    };

    if (validCodes[discountCode.toUpperCase()]) {
      setDiscountPercentage(validCodes[discountCode.toUpperCase()]);
      setDiscountError('');
    } else {
      setDiscountPercentage(0);
      setDiscountError('Invalid discount code.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500 text-white py-4 px-6 rounded-md shadow-md mb-8">
        <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
      </header>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {cart.map((product, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center border-b py-4 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 rounded-md p-4">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <div className="flex items-center">
                    <span className="text-gray-600 line-through mr-2">${product.price.toFixed(2)}</span>
                    <span className="text-red-600 font-bold">${applyDiscount(product.price)}</span>
                  </div>
                  <div className="mt-2 flex items-center sm:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-6 w-6 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        data-tooltip-id={`tooltip-${index}`}
                        data-tooltip-content={`Rating: ${product.rating}`}
                      >
                        <path d="M12 .587l3.668 7.431 8.214 1.2-5.941 5.787 1.402 8.194L12 18.897l-7.343 3.902 1.402-8.194L.118 9.218l8.214-1.2L12 .587z" />
                      </svg>
                    ))}
                    <Tooltip id={`tooltip-${index}`} />
                  </div>
                  <div className="flex items-center mt-2 sm:justify-start">
                    <button
                      onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded-l"
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-200 text-gray-700">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  {quantityError && <p className="text-red-500">{quantityError}</p>}
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove the Item
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1 bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 p-6 rounded-md shadow-md text-white">
            <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="line-through">${getTotalPrice()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount</span>
              <span>-${getTotalDiscount()}</span>
            </div>
            <hr className="my-2 border-gray-300" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${getDiscountedTotalPrice()}</span>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="border px-2 py-1 rounded mb-2 w-full text-black"
                placeholder="Enter discount code"
              />
              <button
                onClick={handleApplyDiscount}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Apply Discount
              </button>
              {discountError && <p className="text-red-500 mt-2">{discountError}</p>}
            </div>
            <button className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300 shadow-md">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
