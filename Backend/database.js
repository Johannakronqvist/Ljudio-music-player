const sqlite = require('better-sqlite3');
const conn = sqlite('MusicPlayer.db')

// all() is used with SELECT queries
function all(query, params = {}) {
    //prepare statement
    const statement = conn.prepare(query)
    return statement.all(params)
}

// get() returns only the value for the specified key if the key exists in the database
// if not it returns none
function get(query, params = {}) {
    //prepare statement
    const statement = conn.prepare(query)
    // console.log(statement.get(params),'statement')
    return statement.get(params)
}

// run() is used with when a query does a change in the database
function run(query, params = {}) {
    //prepare statement
    const statement = conn.prepare(query)
    return statement.run(params)
}

// functions to communicate inbetween the database and Node 
// and can be imported to use them anywhere in our code
module.exports = {

    // used for login in auth.js
    getUserByUsername(username) {
        let user = get(`SELECT * FROM User WHERE User.Username = @username`, { username: username })
        return user
    },

    // register new account
    createNewAccount(newUser) {
        const query = `INSERT INTO User(FullName, Username, Password, Email) VALUES(@FullName, @Username, @Password, @Email)`
        return run(query, newUser)
    },

    // Add song to playlist
    addSongPlaylist(newSong,playlistId,id) {
        const songQuery = `SELECT songId,id FROM Song WHERE songId = @songId`
         let song = all(songQuery,{songId:newSong.songId});
         console.log(song)
         if(song.length) {
               const crossQuery = `SELECT playlist_id,song_id FROM CrossTable WHERE song_id = @songId AND playlist_id = @playlistId`;
               const songInPlaylist = all(crossQuery, { songId: song[0].id,playlistId});
               if(songInPlaylist.length) return null;
         } else {
             const query = `INSERT INTO Song(Song_name, Artist, Album, image,songId) VALUES(@songName, @artist, @album, @image,@songId)`;
             const returnData = run(query, newSong);
            song = [{id:returnData.lastInsertRowid}]
         }
        const queryCross = `INSERT INTO CrossTable(playlist_id,song_id) VALUES(@playlistId, @songId)`;
        run(queryCross, { songId: song[0].id,playlistId:playlistId});
        return newSong
    },

    // gets all users and their playlists
    getUserPlaylists() {
        let user = all(`SELECT User.*, p.Playlist_name, p.user_id AS playlist FROM User
        LEFT JOIN PLAYLIST AS p
        ON user_id = User.id`)
        return convertUserPlaylists(user)
    },

    // gets all playlist songs
    getPlaylistSongs(id) {
        let user = all(`SELECT * FROM Song AS s
        LEFT JOIN CrossTable AS c
        ON c.song_id = s.id
        WHERE c.playlist_id = @id`,{ id: id })
        return user;
    },

    // gets specific user by id and its playlists
    getUserById(id) {
        let user = all(`SELECT User.*,p.id AS play_id,p.Playlist_name, p.user_id AS playlist FROM User
        LEFT JOIN PLAYLIST AS p
        ON user_id = User.id
        WHERE User.id = @id
        ORDER BY P.id DESC`, { id: id })
        return convertUserPlaylists(user)[0]
    },

    // create a new playlist
    createNewPlaylist(newPlaylist, userId) {
        const query = `
        INSERT INTO PLAYLIST(Playlist_name, user_id)
        VALUES (@Playlist_name, @user_id)`
        return run(query, {Playlist_name: newPlaylist, user_id: userId})
    },

    //delete playlist
    deletePlaylist(id) {
        const query = `
        DELETE FROM  Playlist 
        WHERE id=@id`
        return run(query, {id})
    },

    //delete song from user playlist
    deleteSong(deletedSong) {
        const query = `
        DELETE FROM Song
        WHERE songId=@songId`
        return run(query, {songId:deletedSong})
    }
}


// function to convert duplicated user rows when using the all() function
// into separate user rows with playlists in an array
function convertUserPlaylists(users) {
    // array to keep track of user ids
    const ids = []
    //array to store duplicated users
    const converted = []

    for (let user of users) {
        // check that we don't duplicate the user
        if (!ids.includes(user.id)) {
            converted.push({
                id: user.id,
                FullName: user.FullName,
                Username: user.Username,
                Email: user.Email,
                PLAYLIST: []
            })
        }

        // add id to the tracking list
        ids.push(user.id)

        if (user.playlist) {
            //get the last converted user and add playlists
            let convertedUser = converted[converted.length - 1]
            convertedUser.PLAYLIST.push({
                Playlist_name: user.Playlist_name,
                user_id: user.id,
                id:user.play_id
            })
        }
    }

    return converted

}



