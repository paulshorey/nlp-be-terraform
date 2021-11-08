// IMPORTS
import fs from 'fs';

// CONSTS
const dir = 'playlists/dark-noise';
const data = {};
// const fil = `${dir}/caravan by reptilereptile _ 8tracks _ Handcrafted internet radio.html`;

// ALL PLAYLISTS
const playlists = [];
(fs.readdirSync(dir) || []).forEach(function (file) {
  if (!fs.lstatSync(dir + '/' + file).isDirectory()) {
    playlists.push(dir + '/' + file);
  }
});

playlists.forEach(function (htmlFileName) {

  // HTML
  let html;
  try {
    let buffer = fs.readFileSync(`${htmlFileName}`);
    html = buffer.toString();
  } catch (e) {
    console.error(e.message);
  }

  // IMG
  let img;
  if (html) {
    let found = html.match(/id="cover_facade.*\n.*src="([^"]+)"/);
    if (found && found[1] && found[1][0] === ".") {
      img = found[1].substring(1);
    } else {
      console.error('img not found');
    }
  }
  if (img) {
    // get file extension
    // let ext = img.
    // fs.filecopySync(dir + '/' + img, dir + '/'+ htmlFileName.replace('.html',''))
  }

  data[htmlFileName] = {
    img: img
  }
});

console.log(data)

