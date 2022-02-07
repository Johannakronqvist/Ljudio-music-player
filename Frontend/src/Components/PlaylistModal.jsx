import React from "react";
import "./PlaylistModal.css"

function PlaylistModal({ children }) {
  return (
    <div>
      <div
        className="modal fade bd-example-modal-sm"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="mySmallModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header"> 
              <h5 className="modal-title" id="exampleModalLabel">
                Save to playlist
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{children}</div>
            {/* <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Add to playlist
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistModal;
