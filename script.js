//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // create episodes container
  const episodes =  document.createElement('div');
  episodes.classList.add('episodes');

  // create episodes list
  const episodesList =  document.createElement('ul');
  episodesList.classList.add('episodes_list');

  episodeList.forEach((episode)=> createEpisodeCard(episode, episodesList));
  episodes.append(episodesList)
  rootElem.append(episodes);
}

function createEpisodeCard (episodeInfo, parentElem) {
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
  parentElem.append(card);
}

window.onload = setup;
