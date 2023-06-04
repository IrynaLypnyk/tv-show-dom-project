//You can edit ALL of the code here
async function setup() {
  const allEpisodesUrl = 'https://api.tvmaze.com/shows/82/episodes';
  fetch(allEpisodesUrl)
      .then(response => response.json())
      .then(makePageForEpisodes);
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

  // create episodes search form
  const searchForm = createEpisodeSearchForm(episodes);

  //appends
  [searchForm].forEach(elem => episodesContainer.append(elem));
  [episodesList].forEach(elem => episodesContainer.append(elem));
  [episodesContainer].forEach(elem => rootElem.append(elem))
}

function formatNumWithPadStart (num) {
  return String(num).padStart(2, '0');
}

function getEpisodesSeasonAndNumberFormatted ({season, number}) {
  return `S${formatNumWithPadStart(season)}E${formatNumWithPadStart(number)}`
}

function createEpisodeOneCard (episode) {
  const {name, season, number, image: {medium: imageUrl}, summary} = episode;

  //create card
  const card = document.createElement('li');
  card.classList.add('episodes_item', 'card');

  //create title
  const title = document.createElement('div');
  title.classList.add('card_title');
  const titleFormatted = `${name} - ${getEpisodesSeasonAndNumberFormatted({season, number})}`;
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

// SEARCH

function createEpisodeSearchForm (episodes) {
  // create episodes search form
  const searchForm = document.createElement('form');
  searchForm.id = 'episodeSearchForm';
  const searchFormContent = document.createElement('div');
  searchFormContent.classList.add('form_content');


  const search = createEpisodesSearch(episodes) || {};
  const select = createEpisodesSelect(episodes) || {};
  const allEpisodesQty = episodes.length;
  const resultText = createEpisodesSearchResultText(allEpisodesQty);

  //appends
  [select, search, resultText].forEach(elem => searchFormContent.append(elem));
  [searchFormContent].forEach(elem => searchForm.append(elem));

  return searchForm;
}
function createEpisodesSelect (episodes) {
  const selectContainer = document.createElement('div');
  selectContainer.classList.add('select');

  const select = document.createElement('select');
  select.id = "episodesSelect";
  select.name = "episodesSelect";
  select.addEventListener('change', makeSelect(episodes))

  function createSelectOption (episode){
    const {name, season, number} = episode;
    const nameAndSeason = getEpisodesSeasonAndNumberFormatted({season, number});
    const titleFormatted = `${nameAndSeason} - ${name}`;
    const option = document.createElement('option');
    option.innerText = titleFormatted;
    option.value = nameAndSeason;
    return option;
  }

  function createSelectFirstOption (){
    const option = document.createElement('option');
    option.innerText = 'Select episode';
    option.value = '';
    option.selected = true;
    return option;
  }

  select.append(createSelectFirstOption())

  episodes.forEach(episode => {
    const option = createSelectOption(episode);
    select.append(option);
  })

  selectContainer.append(select);

  return selectContainer;
}
function createEpisodesSearch (episodes) {
  const search = document.createElement('div');
  search.classList.add('search');

  const searchInput = document.createElement('input');
  searchInput.classList.add('search_input');
  searchInput.name = "episode";
  searchInput.placeholder = 'Enter text for search';
  searchInput.addEventListener('input', makeSearch(episodes))

 search.append(searchInput);

  return search;
}
function createEpisodesSearchResultText (allEpisodesQty) {
  const searchText = document.createElement('span');
  const initialFilteredEpisodesQty = allEpisodesQty;
  searchText.classList.add('search_text');
  searchText.innerHTML = `Displaying <span id="filteredEpisodesQty">${initialFilteredEpisodesQty}</span>/${allEpisodesQty} episodes`;
  return searchText;
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
function makeSelect (episodes) {
  return function (ev){
    const value = ev.target.value;
    const filteredEpisodesQtyElem = document.getElementById("filteredEpisodesQty");
    if(value) {
      const episodesFiltered = episodes.filter(episode => {
        const {number, season} = episode;
        const nameAndSeasonFormatted = getEpisodesSeasonAndNumberFormatted({season, number});
        return value === nameAndSeasonFormatted;
      });
      filteredEpisodesQtyElem.innerText = episodesFiltered.length;
      updateEpisodesList(episodesFiltered);
    } else {
      filteredEpisodesQtyElem.innerText = episodes.length;
      updateEpisodesList(episodes);
    }
  };
}

window.onload = setup;
