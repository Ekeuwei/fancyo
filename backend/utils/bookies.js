const dayjs = require('dayjs');
const got =  require('got')
const PromiseFtp = require('promise-ftp');

exports.sporty = async (ticketId)=> {

    const url = `https://www.sportybet.com/api/ng/orders/share/${ticketId.toUpperCase()}`;
    
    const response = await got.get(url).json();

    if(response.innerMsg === "Invalid"){
        throw new Error("The code is invalid.")
    }

    let games;

    try {
            games = response.data.outcomes.map((game)=>({
                league: `${game.sport.category.name}, ${game.sport.category.tournament.name}`,
                time: game.estimateStartTime,
                homeTeam: game.homeTeamName,
                awayTeam: game.awayTeamName,
                scores: !(game.status > 2 || game.matchStatus==='Ended' || game.matchStatus==='AP')? {ft:"",ht:""}:{ht: game.gameScore?.[0], ft: game.setScore},
                prediction: game.markets[0].outcomes[0].desc,
                market: game.markets[0].desc,
                outcome: game.markets[0].outcomes[0].isWinning,
                odds: game.markets[0].outcomes[0].odds,
                matchStatus: game.matchStatus,
                status: game.status,
            }))
        
    } catch (error) {
        throw new Error()
    }

    return games;
}

exports.sportyBetting = async (ticketId, accessType)=> {

    const url = `https://www.sportybet.com/api/ng/orders/share/${ticketId.toUpperCase()}`;
    
    const response = await got.get(url).json();

    if(response.innerMsg === "Invalid"){
        throw new Error("The code is invalid.")
    }

    let games;

    try {
            // games = response.data.outcomes
            games = response.data.outcomes.map((game, idx)=>({
                time: dayjs(game.estimateStartTime).format('HH:mm'),
                date: dayjs(game.estimateStartTime).format('YYYYMMDD'),
                country: `${game.sport.category.name}`,
                league: `${game.sport.category.tournament.name}`,
                home: game.homeTeamName,
                away: game.awayTeamName,
                pick: getBettingPickShortCode(`${game.markets[0].desc}: ${game.markets[0].outcomes[0].desc}`), //get pick
                score: !(game.status > 2 || game.matchStatus==='Ended' || game.matchStatus==='AP')? "?":game.setScore.replace(':','-'),
                odd: game.markets[0].outcomes[0].odds,
                first: idx === 0,
                last: idx === response.data.outcomes.length - 1,
                type: accessType||'free'
            }))
            // games = response.data.outcomes.map((game)=>({
            //     league: `${game.sport.category.name}, ${game.sport.category.tournament.name}`,
            //     time: game.estimateStartTime,
            //     homeTeam: game.homeTeamName,
            //     awayTeam: game.awayTeamName,
            //     scores: !(game.status > 2 || game.matchStatus==='Ended' || game.matchStatus==='AP')? {ft:"",ht:""}:{ht: game.gameScore?.[0], ft: game.setScore},
            //     prediction: game.markets[0].outcomes[0].desc,
            //     market: game.markets[0].desc,
            //     outcome: game.markets[0].outcomes[0].isWinning,
            //     odds: game.markets[0].outcomes[0].odds,
            //     matchStatus: game.matchStatus,
            //     status: game.status,
            // }))
        
    } catch (error) {
        throw new Error()
    }

    return games;
}

// Node 18+ (or install node-fetch for older versions)

exports.download = async (fileName, url) => {
  const cleanName = fileName.replace(/-/g, '');
  const fullUrl = `${url}${cleanName}.json`;

  console.log(`Fetching tips from ${fullUrl}`);

  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(err.message);
    return false;
  }
}


exports.upload = async (uploadData, fileName, directory)=> {
  // Remove http:// prefix if present
  const dir = directory.replace(/^http:\/\//, '');
  const ftp = new PromiseFtp();
  let isUploaded = false;

  // Quick check: must be a non-empty array or object
  const hasData =
    (Array.isArray(uploadData) && uploadData.length > 0) ||
    (uploadData && typeof uploadData === 'object' && Object.keys(uploadData).length > 0);

  if (!hasData) return isUploaded;

  const config = {
    host: process.env.FTP_URL,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD
  };

  const cleanedName = fileName.replace(/-/g, '');
  const remotePath = `${dir}/${cleanedName}.json`;

  console.log(`Uploading to ${remotePath}`);

  try {
    await ftp.connect(config);
    const jsonContent = JSON.stringify(uploadData);
    await ftp.put(Buffer.from(jsonContent, 'utf8'), remotePath);
    console.log(`${cleanedName} successfully uploaded to ${dir}`);
    isUploaded = true;
  } catch (err) {
    console.error('FTP upload error:', err.message);
  } finally {
    // Always end the session
    try {
      await ftp.end();
    } catch (endErr) {
      console.error('Error closing FTP connection:', endErr.message);
    }
  }

  return isUploaded;
}



function getBettingPickShortCode(prediction){
    switch (prediction) {
        case '1X2: Home':
            return '1';
        case '1X2: Away':
            return '2';
        case '1X2: Draw':
            return 'X';
        case 'Double Chance: Home or Draw':
            return '1X';
        case 'Double Chance: Home or Away':
            return '12';
        case 'Double Chance: Draw or Away':
            return 'X2';
        case 'Over/Under: Over 1.5':
            return 'o1.5';
        case 'Over/Under: Under 1.5':
            return 'u1.5';
        case 'Over/Under: Over 2.5':
            return 'o2.5';
        case 'Over/Under: Under 2.5':
            return 'u2.5';
        case 'Over/Under: Over 3.5':
            return 'o3.5';
        case 'Over/Under: Under 3.5':
            return 'u3.5';
        case 'Over/Under: Over 4.5':
            return 'o4.5';
        case 'Over/Under: Under 4.5':
            return 'u4.5';
        case 'GG/NG: Yes':
            return "bts";
        case 'GG/NG: No':
            return "nbts";
    
        default:
            return prediction
    }
}