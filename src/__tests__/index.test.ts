/*=========================================================
    Imports
=========================================================*/

import fs from 'fs/promises';
import {describe, expect, test} from '@jest/globals';
import parserDiscovery from './data/parsing/discovery.json';
import formattingDiscovery from './data/formatting/discovery.json';
import path from 'path';
import { format, parse } from '..';
import Expression from '../types/expression';

/*=========================================================
    Tests
=========================================================*/

describe('formula-parsing', () => {

  for(const fileName of parserDiscovery) {
    test(`${fileName} parses correctly`, async () => {
      //Grab files
      const [data, expectedResult] = await Promise.all([
        fs.readFile(
          path.join(
            __dirname, 
            'data', 
            'parsing', 
            fileName + '.sf-formula'
          )
        ).then(
          pFileData => pFileData.toString()
        ),
        fs.readFile(
          path.join(
            __dirname, 
            'data', 
            'parsing', 
            fileName + '.json'
          )
        ).then(
          pFileData => pFileData.toString()
        )
      ]);
      //Run test
      const results = parse(data);
      //Assert
      expect(JSON.stringify(results, undefined, 2)).toBe(expectedResult);
    }); 
  }

}); 

describe('formula-formatting', () => {

  for(const fileName of formattingDiscovery) {
    test(`${fileName} formats correctly`, async () => {
      //Grab files
      const [data, expectedResult] = await Promise.all([
        fs.readFile(
          path.join(
            __dirname, 
            'data', 
            'formatting', 
            fileName + '.json'
          )
        ).then(
          pFileData => JSON.parse(pFileData.toString()) as Expression
        ),
        fs.readFile(
          path.join(
            __dirname, 
            'data', 
            'formatting', 
            fileName + '.sf-formula'
          )
        ).then(
          pFileData => pFileData.toString()
        )
      ]);
      //Run test
      const results = format(data);
      //Assert
      expect(results).toBe(expectedResult);
    }); 
  }

}); 