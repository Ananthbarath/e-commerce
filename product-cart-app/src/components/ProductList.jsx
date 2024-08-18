import { useState } from "react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ProductList = () => {
    const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Number of products per page
  const [sortOption, setSortOption] = useState('');
  const navigate=useNavigate();
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],});
  
    useEffect(() => {
        fetch('/products.json')
          .then((response) => response.json())
          .then((data) => {
            setProducts(data);
            setFilteredProducts(data);
          })
          .catch((error) => console.error('Error fetching products:', error));
      }, []);

    useEffect(() => {
        applyFilters();
      }, [filters, sortOption, products]);
    
      const applyFilters = () => {
        let filtered = products;
    
        // Apply category filter
        if (filters.category) {
          filtered = filtered.filter(
            (product) => product.category === filters.category
          );
        }
    
        // Apply price range filter
        filtered = filtered.filter(
          (product) =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );
    
        // Apply sorting
        if (sortOption === 'priceLowHigh') {
          filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'priceHighLow') {
          filtered = filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'rating') {
          filtered = filtered.sort((a, b) => b.rating - a.rating);
        }
    
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page after filtering/sorting
      };
    
      const handleFilterChange = (e) => {
        setFilters({
          ...filters,
          [e.target.name]: e.target.value,
        });
      };
    
      const handlePriceRangeChange = (e) => {
        const value = e.target.value.split(',');
        setFilters({
          ...filters,
          priceRange: value.map(Number),
        });
      };
    
      const handleSortChange = (e) => {
        setSortOption(e.target.value);
      };
    
      // Pagination logic
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );
    
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
      const paginate = (pageNumber) => setCurrentPage(pageNumber);

      const handleAddToCart = (product) => {
        addToCart(product);
        navigate('/cart');  // Navigate to the cart page after adding the product
      };


  const applyDiscount = (price) => {
    return (price * 0.9).toFixed(2); // 10% discount for demonstration
  };

  const handleRating = (productId, rating) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, userRating: rating }
          : product
      )
    );
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return (total / ratings.length).toFixed(1);
  };
  
    return (
        <div className="container mx-auto px-4 py-6">
      <header className="bg-gradient-to-r from-blue-500 via-Blue-500 to-Blue-500 text-white py-4 px-6 rounded-md shadow-md mb-8">
        <h1 className="text-3xl font-bold ">Shop Our Products</h1>
      </header>

      {/* Filter and Sorting Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
        </select>

        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          className="border p-2 rounded"
        >
          <option value={[0, 1000]}>All Prices</option>
          <option value={[0, 50]}>$0 - $50</option>
          <option value={[50, 100]}>$50 - $100</option>
          <option value={[100, 500]}>$100 - $500</option>
          <option value={[500, 1000]}>$500 - $1000</option>
        </select>

        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Product Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4 hover:scale-105 transition-transform duration-300"
              />
              {product.discount && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <div className="flex items-center justify-between mb-2">
              
              <span className="text-xl text-red-600 font-bold">${applyDiscount(product.price)}</span>
              <p className="text-m font-bold text-green-600 line-through mr-2">
                ${product.price.toFixed(2)}
              </p>
              </div>
              <div className="flex items-center mt-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`h-6 w-6 ${index < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431 8.214 1.2-5.941 5.787 1.402 8.194L12 18.897l-7.343 3.902 1.402-8.194L.118 9.218l8.214-1.2L12 .587z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-700">({product.reviews})</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`border px-3 py-1 rounded mx-1 ${
              currentPage === index + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-black'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
    );
  };
  
  export default ProductList;
  