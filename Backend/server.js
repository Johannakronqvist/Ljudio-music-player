const db = require('./database.js');
var bcrypt = require('bcryptjs');
var config = require('./config');
const express = require('express');
const auth = require('./auth.js');
const app = express();


//body parser
app.use(express.json());


//creating endpoint for login
app.post('/api/auth', (req, res) => {
    res.json(auth.login(req, res))
})

//registration of a new user
app.post('/api/user', (req, res) => {
    console.log(req.body)
    let newUser = req.body
    //hashing password before going into the database
    bcrypt.hash(newUser.Password, 10, (err, hash) => {
        //changing plane password to hashed one
        newUser.Password = hash
        // inserts new user into the database and sets its id to auto incremented id
        let insert = db.createNewAccount(newUser)
        newUser.id = insert.lastInsertRowid
        //returns user with updated id
        res.json(newUser)
    });
})


//get all users and their playlists
app.get('/api/user', auth.authenticateJWT, (req, res) => {
    res.json(db.getUserPlaylists())
});

/* app.get('/api/user', (req, res) => {
    res.json(db.getUserPlaylists())
}) */

//get users playlist by id
app.get('/api/userplaylist', auth.authenticateJWT, (req, res) => {
    let id = req.user.id
    res.json(db.getUserById(id))
})

// create new playlist
app.post('/api/playlist', auth.authenticateJWT, (req, res) => {
    let newPlaylist = req.body.Playlist_name
    let userId = req.user.id
    // inserts new playlist into the database PLAYLIST and sets its id to auto incremented id
    let insert = db.createNewPlaylist(newPlaylist, userId)
    res.json({
      id: insert.lastInsertRowid,
      Playlist_name: newPlaylist,
      user_id:userId,
    });
})

app.delete("/api/playlist", auth.authenticateJWT, (req, res) => {
  let id = req.body.playlistId;
  console.log(req.body.playlistId);

  //let userId = req.user.id

  try {
    let deletePlaylist = db.deletePlaylist(id);
    res.json({ id: deletePlaylist, playlistId: id });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failure",
      message: "Unable to delete playlist!",
    });
  }
});

// add song to user playlist
app.post('/api/user/playlist/song', auth.authenticateJWT, (req, res) => {
    let playlistId = req.body.playlistId
    let addedSong = req.body.song
    // console.log(req.body)
    // inserts song into the playlist and sets its id to auto incremented id
    let insert = db.addSongPlaylist(addedSong,playlistId);
    console.log(insert,'insert')
    //returns song with updated id
    res.json({data:insert});
})



// Get songs from playlist
app.get('/api/user/playlist/song/:id', auth.authenticateJWT, (req, res) => {
    let playlistId = req.params.id
    // inserts song into the playlist and sets its id to auto incremented id
    let songs = db.getPlaylistSongs(playlistId);

    //returns song with updated id
    res.json(songs)
})

//delete song from user playlist
app.delete("/api/song", auth.authenticateJWT, (req, res) => {
    const songId = req.body.songId
    // console.log(id)
  try {
    const deletedSong = db.deleteSong(songId);
    res.json(deletedSong);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failure",
      message: "Unable to delete song from a playlist!",
    });
  }
});


app.listen(4000, () => console.log('Server started at port 4000'));
