import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = document.querySelector('input[name="searchQuery"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let loadedImages = 0;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentQuery = input.value.trim();
  if (!currentQuery) {
  iziToast.warning({ message: 'Please enter a search query!' });
  return;
}

  currentPage = 1;
  loadedImages = 0;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;
    loadedImages += data.hits.length;

  if (data.hits.length === 0) {
    iziToast.info({ message: 'Sorry, no images found.' });
    return;
  }


    createGallery(data.hits);
    if (loadedImages < totalHits) {
  showLoadMoreButton();
    } else {
    hideLoadMoreButton();
    iziToast.info({
    message: "We're sorry, but you've reached the end of search results.",
  });
  }

  } catch (error) {
    clearGallery();
    hideLoadMoreButton();
    iziToast.error({ message: 'Something went wrong.' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
       
  hideLoadMoreButton();
  showLoader(); 
  loadMoreBtn.disabled = true;

  try {
    const nextPage = currentPage + 1;
    const data = await getImagesByQuery(currentQuery, nextPage);
    currentPage = nextPage;
   
    createGallery(data.hits);
    loadedImages += data.hits.length;

    smoothScroll();

    if (loadedImages >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      showLoadMoreButton(); 
    }

  } catch (error) {
    clearGallery();
    hideLoadMoreButton();
    iziToast.error({ message: 'Failed to load more images.' });
  } finally {
    hideLoader(); 
    loadMoreBtn.disabled = false;
  }
});

function smoothScroll() {
  const first = document.querySelector('.gallery')?.firstElementChild; 
  if (!first) return;                                                 
  const { height: cardHeight } = first.getBoundingClientRect();      

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
