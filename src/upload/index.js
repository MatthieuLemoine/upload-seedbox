import request from 'request-promise';
import path from 'path';
import { deleteTorrent, getTorrent } from '../torrents';
import logger from '../logger';

const URL = `https://u2.seedbox.fr/v/${process.env.SEEDBOX}/rpc`;
const Authorization = `Basic ${toBase64(`${process.env.USERNAME}:${process.env.PASSWORD}`)}`;

export default upload;

async function upload(filePath) {
  const { base: name, ext } = path.parse(filePath);
  if (ext !== '.torrent') {
    return;
  }
  try {
    const sessionId = await getSessionId();
    const torrent = await getTorrent(filePath);
    logger.info(`Uploading ${name}`);
    await request({
      url: URL,
      method: 'POST',
      headers: {
        Authorization,
        Referer: `https://u2.seedbox.fr/v/${process.env.SEEDBOX}/web/`,
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/61.0.3163.100 Chrome/61.0.3163.100 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Transmission-Session-Id': sessionId,
      },
      body: JSON.stringify({
        method: 'torrent-add',
        arguments: {
          metainfo: torrent,
          'download-dir': `/home/${process.env.USERNAME}`,
          paused: false,
        },
        tag: '',
      }),
    });
    logger.info(`${name} uploaded`);
    await deleteTorrent(filePath);
    logger.info(`${name} deleted`);
  } catch (e) {
    logger.error(`Error while uploading ${name}`);
    console.error(e);
  }
}

function toBase64(string) {
  return Buffer.from(string).toString('base64');
}

function getSessionId() {
  return request({
    url: URL,
    method: 'POST',
    headers: {
      Authorization,
      Referer: `https://u2.seedbox.fr/v/${process.env.SEEDBOX}/web/`,
    },
    resolveWithFullResponse: true,
  })
    .then(res => res.response.headers['x-transmission-session-id'])
    .catch(res => res.response.headers['x-transmission-session-id']);
}
