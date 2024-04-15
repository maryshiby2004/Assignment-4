/**
 * Documentations That I used are :-
 * LastFm Api docs : https://www.last.fm/api
 * spotify documentation : https://developer.spotify.com/documentation/web-api
 * mdn web docs :- 1) https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 *                 2) https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction
 *                 3) https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents
 *
 */
document.addEventListener("DOMContentLoaded", function () {
    // function to het detailss
    const result = document.getElementById("result");
    const searchBtn = document.getElementById("search-btn");
    const genreSelect = document.getElementById("genre");
  
    // APi key i genrated  
    const apiKey = "6eabbc94590c36dfad51ec088400339f";
  
    //  my info
    const studentId = "200559969";
    const studentName = "Alana Mary Shiby";
    const headerContent = document.querySelector(".header-content");
    const studentInfo = document.createElement("p");
    studentInfo.textContent = `Student ID: ${studentId} | Name: ${studentName}`;
    document.querySelector(".student-info").appendChild(studentInfo);
  
    // Event lto search 
    searchBtn.addEventListener("click", async () => {
      
      const selectedGenre = genreSelect.value;
  
      try {
       
        const topTracks = await fetchTopTracks(apiKey, selectedGenre);
  
        // Display the details 
        displayTracks(topTracks);
      } catch (error) {
        console.error("Error:", error);
        result.innerHTML = "<h3>Error fetching data</h3>";
      }
    });
  
    
    async function fetchTopTracks(apiKey, genre) {
      try {
        // request to api
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${apiKey}&format=json&limit=5&lang=en`
        );
  
        //  successful try and error 
        if (!response.ok) {
          throw new Error(
            `Fetching top tracks failed with status ${response.status}`
          );
        }
  
    
        const data = await response.json();
  
        // Extract the tracks from the response
        return data.tracks.track;
      } catch (error) {
        console.error("Fetch top tracks error:", error);
        throw error;
      }
    }
  
    // Function to display tracks in the HTML
    async function displayTracks(tracks) {
      // Clear the previous results
      result.innerHTML = "";
  
      // Loop through each track and display its information
      for (const track of tracks) {
        // Fetching additional details for each track
        const albumImage = await fetchAlbumImage(
          apiKey,
          track.artist.name,
          track.name
        );
        const trackDetails = await fetchTrackDetails(
          apiKey,
          track.artist.name,
          track.name
        );
  
        // Display all the  track information inside the HTML
        result.innerHTML += `
            <div class="track">
              <img src="${albumImage}" alt="${track.name}">
              <p>${track.name} - ${track.artist.name}</p>
              <p>Album: ${trackDetails.album}</p>
              <p>Play on <a href="${trackDetails.url}" target="_blank">Last.fm</a></p>
            </div>
          `;
      }
    }
  
    // adding a function to fetch the album image for a track
    async function fetchAlbumImage(apiKey, artist, track) {
      try {
        // Making  a request to the Last.fm API to get track details
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(
            artist
          )}&track=${encodeURIComponent(track)}&format=json`
        );
  
        if (!response.ok) {
          throw new Error(
            `Fetching album image failed with status ${response.status}`
          );
        }
  
        
        const data = await response.json();
  
        const albumImage = data.track.album.image[3]["#text"]; 
  
        
        return albumImage || "default_image_url.jpg";
      } catch (error) {
        console.error("Fetch album image error:", error);
  
        //in case an errors shows up return to default image
        return "default_image_url.jpg";
      }
    }
  
    // adding a function to fetch additional details for a track
    async function fetchTrackDetails(apiKey, artist, track) {
      try {
        // Making a request to the Last.fm API to get track details
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(
            artist
          )}&track=${encodeURIComponent(track)}&format=json`
        );
  
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(
            `Fetching track details failed with status ${response.status}`
          );
        }
  
        // Parse the JSON response
        const data = await response.json();
  
        // Extract all the album title and track URL from the response
        return {
          album: data.track.album.title,
          url: data.track.url,
        };
      } catch (error) {
        console.error("Fetch track details error:", error);
  
        // in case of errors return to default
        return {
          album: "Unknown",
          url: "#",
        };
      }
    }
  });
