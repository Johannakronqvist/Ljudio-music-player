import React,{useState} from "react";
// import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../Constants/apiContants";

function ShowPlaylist({ playlists, addSongPlaylist }) {
  const [playlistId,setPlaylistId] = useState();

  function handleRadioSelect(event) {
    setPlaylistId(event.target.value);
  }

  function saveSongplaylist(e) {
    e.preventDefault();
    addSongPlaylist(playlistId);
  }

  function alertSuccess() {
    if(saveSongplaylist = true) {
      console.log('success')
    }
  }

  return (
    <form onSubmit={saveSongplaylist}>
      <ul className="list-group" onChange={handleRadioSelect}>
        {playlists.map((playlist) => (
          <li key={playlist.id} className="list-group-item">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="playlistRadio"
                id={"playlist" + playlist.id}
                value={playlist.id}
              />
              <label
                className="form-check-label"
                htmlFor={"playlist" + playlist.id}
              >
                {playlist.Playlist_name}
              </label>
            </div>
          </li>
        ))}
      </ul>
      <button type="submit" className="btn btn-primary" onClick={alertSuccess} >
        Add to playlist
      </button>
    </form>
  );
}

export default ShowPlaylist;
