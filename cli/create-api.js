import fs from 'fs';
import size from 'image-size';
import dotenv from 'dotenv';
import yaml from 'yaml';

dotenv.config();

(function () {
  const database = fs.readFileSync(process.env.DATABASE_FILE, 'utf-8');
  const response = yaml.parse(database).map(list => {

    return {
      ...list, items: list.items.map(row => {
        const entry = {
          ...row,
          cover: {
            src: `${process.env.PUBLIC_API_IMAGE_PATH.replace('./public', '')}/${row.coverFilename}.webp`,
            ...size(`${process.env.PUBLIC_API_IMAGE_PATH}/${row.coverFilename}.webp`)
          }
        };

        delete entry.coverFilename;

        return entry;
      })
    };
  });

  const json = JSON.stringify(response);
  fs.writeFileSync(process.env.PUBLIC_API_FILE, json);
})();





