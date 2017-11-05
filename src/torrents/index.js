import fs from 'fs';
import chokidar from 'chokidar';
import util from 'util';

const watcher = chokidar.watch(process.env.FOLDER);
const unlink = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);

export default function watchForTorrents(callback) {
  watcher.on('add', callback);
}

export function deleteTorrent(path) {
  return unlink(path);
}

export function getTorrent(path) {
  return readFile(path, { encoding: 'base64' });
}
