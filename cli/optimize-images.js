import fs from 'fs';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

(function () {
  const DATABASE_IMAGE_PATH = process.env.DATABASE_IMAGE_PATH;
  const PUBLIC_API_IMAGE_PATH = process.env.PUBLIC_API_IMAGE_PATH;

  if (!fs.existsSync(PUBLIC_API_IMAGE_PATH)) {
    fs.mkdirSync(PUBLIC_API_IMAGE_PATH, { recursive: true });
  }

  fs.readdirSync(DATABASE_IMAGE_PATH, { withFileTypes: true })
    .filter((file) => !file.isDirectory())
    .forEach((file) =>
      sharp(`${DATABASE_IMAGE_PATH}/${file.name}`)
        .resize(270)
        .webp({ force: true })
        .toFile(`${PUBLIC_API_IMAGE_PATH}/${file.name.split(`.png`)[0]}.webp`)
        .catch(() => console.log(`Error to process ${file.name}`)));
})();