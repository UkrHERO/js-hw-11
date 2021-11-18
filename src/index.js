import './sass/main.scss';
import Notiflix from 'notiflix';

const formRef = document.querySelector('#search-form');
const gallRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');
formRef.addEventListener('submit', onSeachClick);
btnRef.addEventListener('click', onBtnClick);

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '24403167-bc8633b03f504153a86662e6a';
let page = 1;
btnRef.classList.add('is-hidden');

function onSeachClick(e) {
  e.preventDefault();
  console.log(e.currentTarget);
  const value = formRef.elements.searchQuery.value;
  if (value === '') {
    return Notiflix.Notify.warning(
      `Sorry, there are no images matching your search query. Please try again.`,
    );
  }
  page = 1;
  clearGallery();
  getImgs(value).then(renderCards).catch(onError);
}

function onBtnClick(e) {
  const value = formRef.elements.searchQuery.value;
  getImgs(value).then(renderCards).catch(onError);
}

async function getImgs(value) {
  const response = await fetch(
    `${BASE_URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
  );
  const imgs = await response.json();
  page += 1;
  return imgs;
}

function renderCards(cards) {
  const markup = cards.hits
    .map(card => {
      return `<div class="photo-card">
  <img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${card.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${card.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${card.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${card.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallRef.insertAdjacentHTML('beforeend', markup);
  btnRef.classList.remove('is-hidden');
  if (cards.totalHits === cards.total) {
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    btnRef.classList.add('is-hidden');
  }
}

function clearGallery() {
  gallRef.innerHTML = '';
}

function onError() {
  Notiflix.Notify.error(`Oops, not found`);
}
