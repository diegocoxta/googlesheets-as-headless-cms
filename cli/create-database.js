import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import slugify from 'slugify';
import camelcase from 'camelcase';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import yaml from 'yaml';

dotenv.config();

(async function () {
  const DATABASE_FILE = process.env.DATABASE_FILE;

  if (!fs.existsSync(path.dirname(DATABASE_FILE))) {
    fs.mkdirSync(path.dirname(DATABASE_FILE), { recursive: true });
  }

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();

  const sheets = Object.keys(doc.sheetsByTitle);

  const content = await Promise.all(sheets.map(async title => {
    const sheetData = doc.sheetsByTitle[title];
    const rows = await sheetData.getRows();

    const items = rows.map((row) => {
      const details = Object.fromEntries(Object.entries(row)
        .filter(([key]) => key.startsWith('_') === false)
        .map(([key, value]) => {
          if (value === '')
            return [];

          if (key.endsWith('.filename'))
            value = slugify(value, { strict: true, lower: true });


          return [camelcase(key), value];
        }));

      return details;
    });

    return ({
      title,
      items,
    });
  }));

  const data = yaml.stringify(content);
  fs.writeFileSync(DATABASE_FILE, data, 'utf-8');
})();