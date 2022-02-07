import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../Constants/apiContants";
import MediaItem from "./components/MediaItem";
import {
  searchSongs,
  searchArtists,
  searchPlaylistSongs,
} from "../servies/songServies";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import ShowPlaylist from "./components/ShowPlaylist";
import PlaylistModal from "./PlaylistModal";
import DeletePlaylist from "./components/DeletePlaylist";

function MusicPlayer() {
  const [itemList, setItemList] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState("");
  const [currentSongId, setCurrentSongId] = useState("");
  const [playingState, setPlayingState] = useState(false);
  const [activeSong, setActiveSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const playerObj = useRef();

  useEffect(() => {
    (async () => {
      let response = await fetch(API_BASE_URL + "userplaylist", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_NAME),
        },
      });
      response = await response.json();
      let songArray = response.PLAYLIST.map((item) => {
        item.songs = [];
        return item;
      });
      setPlaylists(songArray);
    })();
  }, []);

  return (
    <div className="container py-4">
      <div className="row">
        {/* Tabs starts here */}
        <div className="col-md-6">
          {/* nav-tabs */}
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active"
                id="home-tab"
                data-toggle="tab"
                href="#home"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                Songs
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                id="profile-tab"
                data-toggle="tab"
                href="#profile"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                Playlists
              </a>
            </li>
          </ul>
          {/* tabs content */}
          <div className="tab-content" id="myTabContent">
            {/* song tab content */}
            <div
              style={{ paddingBottom: "260px" }}
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              {/* Input for search songs */}
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type here"
                  aria-label="Search song"
                  aria-describedby="basic-addon2"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {/* Song/artists button */}
              <div
                className="btn-group btn-group-toggle mb-4 "
                data-toggle="buttons"
              >
                <label
                className="btn"
                  onClick={() => onSearch("song")}
                >
                  <input type="radio" name="options" id="option1" />
                  Search
                </label>
                <button className="btn" type="button" data-toggle="collapse" data-target="#collapse">{}Hide Player</button>
              </div>
              {/* Songs list */}
              <div className="songList">
                <div className="list-group">
                  {itemList.map((song, index) => (
                    <MediaItem
                      key={index}
                      active={song.active}
                      type={type}
                      title={song.title}
                      artist={song.artist}
                      image={song.image}
                      id={song.id}
                      onClick={() => playNewSong(song.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* PLAYLIST TAB CONTENT*/}
            <div
              className="tab-pane fade"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div id="accordion">
                {playlists.map((playlist) => (
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h5 className="mb-0">
                        <div style={{ position: "absolute", right: "1rem" }}>
                          {/* delete playlist button */}
                          <DeletePlaylist id={playlist.id} />
                        </div>
                        <div
                          onClick={() => onPlaylistClick(playlist.id)}
                          className="btn btn-link d-flex justify-content-between"
                          data-toggle="collapse"
                          data-target={"#playlist-accordion-" + playlist.id}
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <span>{playlist.Playlist_name}</span>
                        </div>
                      </h5>
                    </div>

                    <div
                      id={"playlist-accordion-" + playlist.id}
                      className="collapse"
                      aria-labelledby="headingOne"
                      data-parent="#accordion"
                    >
                      <div className="card-body">
                        {playlist.songs?.length ? (
                          playlist.songs.map((song) => (
                            <MediaItem
                              playlist
                              active={false}
                              type="song"
                              title={song.Song_name}
                              artist={song.Artist}
                              image={song.image}
                              id={song.songId}
                              onClick={() => playNewSong(song.songId)}
                              removeSongPlaylist={() =>
                                removeSongPlaylist(song.songId,playlist.id)
                              }
                            />
                          ))
                        ) : (
                          <p className="text-center">
                            No songs in this playlist
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Music player starts here*/}
        <div className="col-md-6" >
        
        <div id="collapse">
        <div className="playerBottom fixed-bottom d-flex flex-column justify-content-between" >
          
            <div>
              {/* Musicplayer and artist picture */}
              <div className="d-flex justify-content-center">
                <Player
                  onLoad={onPlayerLoad}
                  onStateChange={onPlayerStateChange}
                />
                {activeSong && (
                  <img
                    src={activeSong.image}
                    alt=""
                    height="auto"
                    width="60%"
                    className="d-none img img-thumbnail"
                  />
                )}
              </div>
              <div className="d-flex justify-content-center">
                <h3>{activeSong?.title}</h3>
              </div>
              <div className="d-flex justify-content-center">
                <h5>{activeSong?.artist}</h5>
              </div>
              {/* PROGRESS BAR STARTS*/}
              {activeSong && (
                <div className="d-flex mt-4">
                  <span className="h3" style={{ flex: 1 }}>
                    {timeFormater(currentTime)}
                  </span>
                  <div className="progressBar" style={{ flex: 7, marginTop: "5px" }}>
                    <input
                      value={currentTime}
                      type="range"
                      className="form-range w-100"
                      min="0"
                      max={duration}
                      id="customRange2"
                      onChange={(e) => updateProgress(e.target.value)}
					  style={{ backgroundColor: 'pink'}}
                    ></input>
                  </div>
                  <span className="h3" style={{ flex: 1, textAlign: "end" }}>
                    {timeFormater(duration)}
                  </span>
                </div>
              )}
              {/* PROGRESS BAR ENDS*/}
            </div>
            {/* PREV,PLAY,PAUSE,NEXT BUTTONS */}
            {activeSong && (
              <div className="d-flex justify-content-center pt-5">
                <div>
                  <button
                    className="btn btn-primary rounded-circle btn-lg"
                    onClick={() => prevNextSong(false)}
                  >
                    <i className="fa fa-step-backward"></i>
                  </button>
                  <button
                    className="btn btn-primary rounded-circle btn-lg mx-3"
                    onClick={startStopSong}
                  >
                    <i
                      className={playingState ? "fa fa-pause" : "fa fa-play"}
                    ></i>
                  </button>
                  <button
                    className="btn btn-primary rounded-circle btn-lg"
                    onClick={() => prevNextSong(true)}
                  >
                    <i className="fa fa-step-forward"></i>
                  </button>

                  <button
                    className="btn btn-primary rounded-circle btn-sm mx-3"
                    type="button"
                    data-toggle="modal"
                    data-target=".bd-example-modal-sm"
                  >
                    <i className="fa fa-music"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
          <PlaylistModal>
            <Playlist
              onCreate={(newPlaylist) =>
                setPlaylists([newPlaylist, ...playlists])
              }
            />
            <ShowPlaylist
              playlists={playlists}
              addSongPlaylist={addSongPlaylist}
            />
          </PlaylistModal>
        </div>
      </div>
    </div>
  );

  /**
   * fetches song,artist or album from the youtube
   * @param {string} type
   */
  async function onSearch(type) {
    setType(type);
    if (type == "song") {
      let songs = await searchSongs(title);
      setItemList(songs);
    } else if (type == "artist") {
      let artists = await searchArtists(title);
      setItemList(artists);
    }
  }

  function onPlayerStateChange(event) {
    if (
      event.data == YT.PlayerState.ENDED ||
      playerObj.current.getCurrentTime() >= playerObj.current.getDuration()
    ) {
      // autoplay next song
      // return nextSong()
    }
  }

  /**
   * Initializes the player
   * @param {Object} player
   */
  function onPlayerLoad(player) {
    setTimeout(() => {
      playerObj.current = player;
    }, 3000);
  }

  /**
   * Plays previous song or next song
   * @param {boolean} next
   */
  function prevNextSong(next) {
    let nextSongObj;
    let playingSong = itemList.find((item) => {
      return item.id == currentSongId;
    });
    let index = itemList.indexOf(playingSong);
    if (next) {
      nextSongObj = itemList[index + 1];
    } else {
      nextSongObj = itemList[index - 1];
    }
    playNewSong(nextSongObj.id);
  }

  /**
   * Plays new song by id
   * @param  {String} songId - youtube videoId
   * @returns {Object}
   * */
  function playNewSong(songId) {
    setCurrentSongId(songId);
    playerObj.current.loadVideoById(songId);
    setPlayingState(true);

    // adds active class to current playing song
    setItemList(
      itemList.map((song) => {
        if (song.id == songId) {
          song.active = true;
          setActiveSong(song);
        } else {
          song.active = false;
        }
        return song;
      })
    );
    setTimeout(() => {
      setDuration(playerObj.current.getDuration());
      setCurrentTime(playerObj.current.getCurrentTime());
      counter();
    }, [3000]);
  }

  /**
   * Starts and stops the songs
   */
  function startStopSong() {
    if (playingState) {
      playerObj.current.pauseVideo();
      setPlayingState(false);
    } else {
      playerObj.current.playVideo();
      setPlayingState(true);
    }
  }

  /**
   * Formats time from seconds to mm:ss
   * @param {string} time
   * @returns {String}
   */
  function timeFormater(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    return minutes + ":" + Math.round(seconds);
  }

  // Returns the elapsed time in seconds since the video started playing.
  function counter() {
    return setInterval(() => {
      setCurrentTime(playerObj.current.getCurrentTime());
    }, 1000);
  }

  function updateProgress(secs) {
    playerObj.current.seekTo(secs);
  }

  async function onPlaylistClick(id) {
    let playlistSongs = await searchPlaylistSongs(id);
    let filtedPlaylist = playlists.map((playlist) => {
      if (playlist.id == id) {
        playlist.songs = playlistSongs;
      } else {
        playlist.songs = [];
      }
      return playlist;
    });
    setPlaylists(filtedPlaylist);
  }

  async function addSongPlaylist(playlistId) {
    let querySong = {
      songName: activeSong.title,
      artist: activeSong.artist,
      album: activeSong.album,
      image: activeSong.image,
      songId: activeSong.id,
    };

    axios({
      method: "POST",
      url: API_BASE_URL + "user/playlist/song",
      data: { playlistId, song: querySong },
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_NAME),
      },
    }).then((response) => {
      console.log(response);
    });
  }
  
  function removeSongPlaylist(songId,playlistId) {
    console.log(playlistId);
    console.log(songId)
      axios({
      method: "DELETE",
      url: API_BASE_URL + "song",
      data: { songId},
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_NAME),
      },
    }).then((response) => {
     let updatedSongs = playlists.map((playlist) => {
        if(playlist.id == playlistId) {
          playlist.songs = playlist.songs.filter((song) => (song.songId != songId))
        }
        return playlist;
      })
      setPlaylists(updatedSongs)

    });
  }
  
}

export default MusicPlayer;
