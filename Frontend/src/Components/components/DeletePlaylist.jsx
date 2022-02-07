import React, { useState, useEffect } from 'react'
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../Constants/apiContants'
import axios from 'axios'

function DeletePlaylist({id}) {
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    (async () => {
      let response = await fetch(API_BASE_URL + "userplaylist", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_NAME),
        },
      });
      response = await response.json();
      let playlists = response.PLAYLIST.map((item) => {
        item.playlists = [];
        return item;
      });
      setPlaylists(playlists);
    })();
  }, []);

  // useEffect(() => {
  //   console.log(id)
  // }, [playlists])

  

function removePlaylist(playlistId) {
  console.log(playlistId)

    axios({
        method: "DELETE",
        url: API_BASE_URL + "playlist",
        data: { playlistId: id },
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN_NAME),
        },
      })
 
      .then((response) => {
        let updatedPlaylist = playlists.map((playlist) => {
          if(playlist.id == playlistId) {
            playlist.id = playlist.id.filter((id) => (id.playlistId != playlistId))
          }
          return playlist;
        })
        setPlaylists(updatedPlaylist)
        console.log(updatedPlaylist)
        console.log(playlists)
      });
}

    return (
        <button className="btn btn-sm btn-danger alert alert-info" role="alert" onClick={removePlaylist} >
        <i className="fa fa-trash"></i>
        </button>
    )
}

export default DeletePlaylist
