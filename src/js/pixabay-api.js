import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51095206-3d2c267d5ed47484eb05d633a';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: PER_PAGE,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Pixabay API error:', error.message);
    throw error;
  }
}
