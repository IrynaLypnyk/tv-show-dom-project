//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

}

function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");

  // create episodes container
  const episodesContainer =  document.createElement('div');
  episodesContainer.classList.add('episodes');

  // create episodes list
  const episodesList =  document.createElement('ul');
  episodesList.id = 'episodesList';
  episodesList.classList.add('episodes_list');
  renderEpisodesItemsList(episodes,episodesList);

  const search = createSearch(episodes);

  //appends
  [search].forEach(elem => episodesContainer.append(elem));
  [episodesList].forEach(elem => episodesContainer.append(elem));
  [episodesContainer].forEach(elem => rootElem.append(elem))
}

function createEpisodeOneCard (episodeInfo) {
  const {name, season, number, image: {medium: imageUrl}, summary} = episodeInfo;

  //create card
  const card = document.createElement('li');
  card.classList.add('episodes_item', 'card');

  //create title
  const title = document.createElement('div');
  title.classList.add('card_title');
  const titleFormatted = `${name} - S${String(season).padStart(2, '0')}E${String(number).padStart(2, '0')}`;
  title.innerHTML = `<h3>${titleFormatted}</h3>`

  //create image
  const image = document.createElement('img');
  image.classList.add('card_image');
  image.src = imageUrl;
  image.alt = `image of episode ${name}`;

  //create descr
  const descr = document.createElement('div');
  descr.classList.add('card_descr');
  descr.innerHTML = summary;

  //append into card
  card.append(title);
  card.append(image);
  card.append(descr);
  return card;
}

function createSearch (episodes) {
  const allEpisodesQty = episodes.length;
  let filteredEpisodesQty = allEpisodesQty;
  const search = document.createElement('div');
  search.classList.add('search');

  const searchInput = document.createElement('input');
  searchInput.classList.add('search_input');
  searchInput.name = "episode";
  searchInput.addEventListener('input', makeSearch(episodes))

  const searchText = document.createElement('span');
  searchText.classList.add('search_text');
  searchText.innerHTML = `Displaying <span id="filteredEpisodesQty">${filteredEpisodesQty}</span>/${allEpisodesQty} episodes`;

  [searchInput, searchText].forEach(elem => search.append(elem));

  return search;
}

function updateEpisodesList (episodes) {
  const episodesListContainer = document.getElementById('episodesList');
  episodesListContainer.innerHTML = '';
  renderEpisodesItemsList(episodes, episodesListContainer);
}

function renderEpisodesItemsList (episodes, parent) {
  episodes.forEach(episode => {
    const episodeItem = createEpisodeOneCard(episode);
    parent.append(episodeItem)
  })
}

function makeSearch (episodes) {
  return function (ev){
    const searchStr = ev.target.value.toLowerCase();
    const episodesFiltered = episodes.filter(episode => episode.name.toLowerCase().includes(searchStr) || episode.summary.toLowerCase().includes(searchStr));
    const filteredEpisodesQtyElem = document.getElementById("filteredEpisodesQty");
    filteredEpisodesQtyElem.innerText = episodesFiltered.length;
    updateEpisodesList(episodesFiltered);
  };
}

window.onload = setup;
