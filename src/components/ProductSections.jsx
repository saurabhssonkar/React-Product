import React, { useEffect, useState, useCallback } from 'react';
import { getCollections, getProductsByCollectionId } from '../api/api';

const ProductSections = () => {
  const [collections, setCollections] = useState([]);
  const [productsByCollection, setProductsByCollection] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page) => {
    setIsFetching(true);
    const { data } = await getCollections(page);
    const activeCollections = data.collections.filter(col => col.isActive);

    if (activeCollections.length === 0) {
      setHasMore(false);
      setIsFetching(false);
      return;
    }

    setCollections(prev => [...prev, ...activeCollections]);

    const productsMap = {};

    await Promise.all(
      activeCollections.map(async (col) => {
        const response = await getProductsByCollectionId(col._id);
        const product = response?.data?.data?.docs?.[0];
        if (product) {
          productsMap[col._id] = {
            name: product.name,
            price: product.price,
            images: product.productPhotos || [],
          };
        }
      })
    );

    setProductsByCollection(prev => ({ ...prev, ...productsMap }));
    setIsFetching(false);
  };

  useEffect(() => {
    fetchData(pageNo);
  }, [pageNo]);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollHeight - scrollTop - clientHeight < 100) {
      setPageNo(prev => prev + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    };

    const debouncedScroll = debounce(handleScroll, 200);
    window.addEventListener('scroll', debouncedScroll);

    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [handleScroll]);

  return (
    <div className='main'>
      <div className="container">
        {collections.map((collection) => {
          const product = productsByCollection[collection._id];
          return (
            <div key={collection._id} className="section">
              <h2 className="section-title">{collection.name.trim()}</h2>
              <div className="products-grid">
                {product?.images?.map((imgUrl, index) => (
                  <div key={index} className="product-card">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">₹{product.price}</div>
                  </div>
                ))}
              </div>
              <div className="button-wrapper">
                <button className="btn">View All</button>
              </div>
            </div>
          );
        })}
        {isFetching && <p style={{ textAlign: 'center' }}>Loading more...</p>}
        {!hasMore && <p style={{ textAlign: 'center' }}>No more collections to show.</p>}
      </div>
    </div>
  );
};

export default ProductSections;
