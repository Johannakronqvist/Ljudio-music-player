import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../Constants/apiContants";

export async function searchSongs(title) {
  let response = await fetch(
    `https://yt-music-api.herokuapp.com/api/yt/songs/${title}`
  );
  response = await response.json();
  return response.content.map((song) => ({
    active: false,
    id: song.videoId,
    title: song.name,
    album: song.album.name,
    artist: song.artist.name,
    image: song.thumbnails[1].url,
  }));
}

export async function searchArtists(title) {
  let response = await fetch(
    `https://yt-music-api.herokuapp.com/api/yt/artists/${title}`
  );
  response = await response.json();
  return response.content.map((artist) => ({
    active: false,
    id: artist.browseId,
    artist: artist.name,
    image: artist.thumbnails[1].url,
  }));
}

export async function searchPlaylistSongs(id) {
  let response = await fetch(`${API_BASE_URL}/user/playlist/song/${id}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_NAME),
    },
  });
  response = await response.json();
  return response
}
