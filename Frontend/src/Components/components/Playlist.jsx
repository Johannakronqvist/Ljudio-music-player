import React, { useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN_NAME, API_BASE_URL } from "../../Constants/apiContants";

function Playlist({onCreate}) {
  const [playlistName, setPlaylistName] = useState("");
  const [showInput, setShowInput] = useState("d-none");
  const [isInvalid, setIsInvalid] = useState("");
  const [invalidFeedback, setInvalidFeedback] = useState("d-none");

  function addPlaylistToUser() {
    if (playlistName.length) {
      let name = playlistName;
      //Sends playlistname to backend endpoint api/playlist/:id
      axios
        .post(
          API_BASE_URL + `playlist`,
          {
            Playlist_name: name,
          },
          {
            //Gets access token from local storage
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem(ACCESS_TOKEN_NAME),
            },
          }
        )
        .then(function (response) {
          console.log(response);
          let newPlaylist = response.data;
          newPlaylist.songs = [];
          onCreate(newPlaylist);
        })
        .catch((error) => {
          console.error("Error", error);
        });
      //Sends instructions to the user to add name to playlist if user try to send an emty inputfield
    }
    if (playlistName.length == 0) {
      setIsInvalid("is-invalid");
      setInvalidFeedback("invalid-feedback");
    }
  }

  return (
    <div className=" d-inline-flex flex-column mb-3">
      <button
        className="btn btn-primary mb-2"
        onClick={() => setShowInput("d-block")}
      >
        Create New Playlist
      </button>

      <div className={showInput}>
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${isInvalid}`}
            value={playlistName}
            placeholder="Name your playlist"
            aria-label="Name your playlist"
            aria-describedby="button-addon2"
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={addPlaylistToUser}
          >
            Add Playlist
          </button>
          <div
            id="validationServerUsernameFeedback"
            className={invalidFeedback}
          >
            Please add a name to your playlist.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
