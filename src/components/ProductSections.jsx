import React, { useEffect, useState } from 'react';
import { getCollections, getProductsByCollectionId } from '../api/api';

const ProductSections = () => {
  const [collections, setCollections] = useState([]);
  const [productsByCollection, setProductsByCollection] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCollections();
      const activeCollections = data.collections.filter(col => col.isActive);
      setCollections(activeCollections);

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

      setProductsByCollection(productsMap);
    };

    fetchData();
  }, []);

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
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default ProductSections;
