import axios from 'axios';

export const searchTrack = async (songName, artistName) => {
  if (!songName || !songName.trim()) {
    return null;
  }

  try {
    const searchTerm = artistName ? `${songName} ${artistName}` : songName;
    
    console.log(`🔍 Searching iTunes for: "${searchTerm}"`);

    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: searchTerm,
        media: 'music',
        entity: 'song',
        limit: 5,
        country: 'US',
      },
      timeout: 8000,
    });

    console.log(`📦 iTunes returned ${response.data.resultCount} results`);

    if (response.data.results && response.data.results.length > 0) {
      let bestMatch = response.data.results[0];
      
      // Try to find exact match
      if (artistName) {
        const exactMatch = response.data.results.find(track => 
          track.artistName.toLowerCase().includes(artistName.toLowerCase()) &&
          track.trackName.toLowerCase().includes(songName.toLowerCase())
        );
        if (exactMatch) bestMatch = exactMatch;
      }

      const track = bestMatch;

      // Get high-res artwork
      let albumCover = null;
      if (track.artworkUrl100) {
        albumCover = track.artworkUrl100
          .replace('/100x100bb.jpg', '/1000x1000bb.jpg')
          .replace('/100x100bb.png', '/1000x1000bb.png');
      }

      const result = {
        id: track.trackId,
        name: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        albumCover: albumCover,
        albumCoverMedium: track.artworkUrl100?.replace('/100x100bb', '/400x400bb'),
        albumCoverSmall: track.artworkUrl100,
        previewUrl: track.previewUrl,
        releaseDate: track.releaseDate,
        duration: track.trackTimeMillis,
        genre: track.primaryGenreName,
        appleMusicUrl: track.trackViewUrl,
        source: 'iTunes',
      };

      console.log('✅ FOUND TRACK:');
      console.log('  Song:', result.name);
      console.log('  Artist:', result.artist);
      console.log('  Album Cover:', result.albumCover);
      console.log('  Preview URL:', result.previewUrl);

      return result;
    }

    console.log('❌ No results found');
    return null;
  } catch (error) {
    console.error('❌ iTunes search error:', error.message);
    return null;
  }
};

export const searchTracks = async (songName, artistName, limit = 5) => {
  try {
    const searchTerm = artistName ? `${songName} ${artistName}` : songName;
    
    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: searchTerm,
        media: 'music',
        entity: 'song',
        limit: limit,
        country: 'US',
      },
      timeout: 8000,
    });

    return response.data.results.map(track => ({
      id: track.trackId,
      name: track.trackName,
      artist: track.artistName,
      album: track.collectionName,
      albumCover: track.artworkUrl100?.replace('/100x100bb', '/1000x1000bb'),
      albumCoverMedium: track.artworkUrl100?.replace('/100x100bb', '/400x400bb'),
      albumCoverSmall: track.artworkUrl100,
      previewUrl: track.previewUrl,
      source: 'iTunes',
    }));
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};