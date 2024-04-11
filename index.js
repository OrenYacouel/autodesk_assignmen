
const api_key = require('./config/keys').apikey;

const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: api_key
});

const express = require('express');
const app = express();
const os = require('os');

// Configuration

const PORT = process.env.PORT || 3000;
const cpuDeltaMs = process.env.CPU_DELTA_MS || 500;

// Youtube API endpoint

app.get('/youtube', async (req, res) => {
  try {
    const response = await youtube.search.list({
        part: 'snippet',
        q: 'Autodesk',
        type: 'video',
        maxResults: 10
    });
    

    const videoIds = response.data.items.map(item => item.id.videoId).join(',');

    const videoDetails  = await youtube.videos.list({
        part: 'snippet,contentDetails,statistics',
        id: videoIds
    });
  
    const videos = videoDetails.data.items.map(video => ({
        title: video.snippet.title,
        length: video.contentDetails.duration,
        views: video.statistics.viewCount
    }));
  
    res.json(videos);

  } catch (error) {
    console.error('Error fetching data from YouTube API', error);
    res.status(500).send('Internal Server Error');
  }
});



// CPU calculation functions


function cpuSnapshot() {
  const cpus = os.cpus();
  let idleTime = 0, cpuTime = 0;
  
  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      cpuTime += cpu.times[type];
    }
    idleTime += cpu.times.idle;
  });
  return {idle: idleTime , total: cpuTime};
}


function sleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function calculateCpuUsage() {
  const startCpu = cpuSnapshot();
  sleep(cpuDeltaMs);
  const endCpu = cpuSnapshot();


  const  idleDiff = endCpu.idle - startCpu.idle;
  const  totalDiff = endCpu.total - startCpu.total;

  return 100 - ((idleDiff / totalDiff) * 100);
}

function calculateMemoryUsage() {
  return 100 - ((os.freemem() / os.totalmem()) * 100);
}

// Health endpoint

app.get('/health', (req, res) => {
  const memoryUsage = calculateMemoryUsage();
  const cpuUsage = calculateCpuUsage();
  
  res.json({
    osName: process.platform,
    languageVersion: process.version,
    memoryUsage: `${memoryUsage.toFixed(2)}%`,
    cpuUsage:`${cpuUsage.toFixed(2)}%`
  });
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));