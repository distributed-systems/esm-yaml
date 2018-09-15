import { stringify, parse } from './src/index.mjs';
import fs from 'fs';
const { promises } = fs;

(async () => {
    const yml = (await promises.readFile('./doc.yml')).toString();

    const doc = parse(yml);
    console.log(doc);

    const str = stringify(doc);
    console.log(str);
})().catch(console.log);

