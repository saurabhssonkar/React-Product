import axios from 'axios';

const API_BASE_URL = 'https://api.dm2buy.com/v3';

export const getCollections = (pageNo) => axios.get(`${API_BASE_URL}/collection/store/7dH0rzP3NJQeB8nC7zMsq6?limit=5&page=${pageNo}`);
export const getProductsByCollectionId = (titleId) =>
  axios.get(`${API_BASE_URL}/product/store/7dH0rzP3NJQeB8nC7zMsq6/collectionv2?page=1&limit=10&source=web&collectionId=${titleId}`);
