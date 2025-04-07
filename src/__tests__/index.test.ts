/*=========================================================
    Imports
=========================================================*/

import fs from 'fs/promises';
import {describe, expect, test} from '@jest/globals';
import discovery from './data/discovery.json';
import path from 'path';
import { format, parse } from '..';
import Expression from '../types/expression';

/*=========================================================
    Tests
=========================================================*/

describe('formula-parsing', () => {

  for(const fileName of discovery) {
    test(`${fileName} parses correctly`, async () => {
      //Grab files
      const data = await fs.readFile(
        path.join(
          __dirname, 
          'data', 
          fileName + '.sf-formula'
        )
      ).then(
        pFileData => pFileData.toString()
      );
      //Run test
      const results = parse(data);
      //Assert
      expect(JSON.stringify(results, undefined, 2)).toMatchSnapshot();
    }); 
  }

}); 

describe('formula-formatting', () => {

  for(const fileName of discovery) {
    test(`${fileName} formats correctly`, async () => {
      //Grab files
      const data = await fs.readFile(
        path.join(
          __dirname, 
          'data', 
          fileName + '.json'
        )
      ).then(
        pFileData => JSON.parse(pFileData.toString()) as Expression
      );
      //Run test
      const results = format(data);
      //Assert
      expect(results).toMatchSnapshot();
    }); 
  }

}); 