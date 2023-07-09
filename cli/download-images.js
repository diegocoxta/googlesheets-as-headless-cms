import fs from 'fs';
import dotenv from 'dotenv';
import yaml from 'yaml';
import download from 'download';
import isImageUrl from 'is-image-url';

dotenv.config();

(function () {
  const DATABASE_FILE = process.env.DATABASE_FILE;
  const DATABASE_IMAGE_PATH = process.env.DATABASE_IMAGE_PATH;

  if (!fs.existsSync(DATABASE_FILE)) {
    throw "the DATABASE_FILE was not found.";
  }

  if (!fs.existsSync(DATABASE_IMAGE_PATH)) {
    fs.mkdirSync(DATABASE_IMAGE_PATH, { recursive: true });
  }

  const file = fs.readFileSync(DATABASE_FILE, 'utf-8');
  const fileContent = yaml.parse(file);

  fileContent.map(({ items, title }) => {
    console.log(`there are ${items.length} items in '${title}' list.`);

    items.map((item, itemIndex) => {
      const images = Object.entries(item).filter(([_key, value]) => isImageUrl(value));

      if (images.length === 0) {
        console.warn(`we cannot find any image for ${JSON.stringify(item)}`);
      }

      images.map(([key, value]) => {
        const newFileName = item[`${key}Filename`];

        if (!newFileName) {
          console.warn(`Does not downloaded ${value} because it don't have a valid filename association.`);
          return [key, value];
        }

        const filename = `${newFileName}.png`;

        download(value, DATABASE_IMAGE_PATH, { filename }).then(() => {
          console.log(`${filename} downloaded`);
        });

        return [key, value];
      });
    })
  });
})();