import React from "react";

function MediaItem({ onClick, title, artist, image, type,active,removeSongPlaylist,playlist}) {
  let classList = "list-group-item list-group-item-action justify-content-between";
  // Adds active class for playing song
  classList += active ? " active": "";
  return (
    <a href="#" className={classList}>
      <div className="d-flex">
        <img
          className="img img-thumbnail rounded"
          src={image}
          alt=""
          style={{ height: "80px", width: "80px" }}
        />
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div className="px-3 d-flex flex-column justify-content-center">
            <h3>{type == "artist" ? artist : title}</h3>
            {type !== "artist" && <span>{artist}</span>}
          </div>
          <div>
            {type == "song" && <i onClick={onClick} className="fa fa-play"></i>}
            {playlist && (
              <i onClick={removeSongPlaylist} className="fa fa-trash ml-3"></i>
            )}
          </div>
        </div>
      </div>
      {type !== "song" && (
        <span
          class="badge badge-secondary p-2"
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          {type}
        </span>
      )}
    </a>
  );
}

export default MediaItem;
