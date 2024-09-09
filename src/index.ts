#! /usr/bin/env node

/*=========================================================
    Imports
=========================================================*/

import fs from 'fs/promises';
import path from 'path';
import Scanner from './processors/scanner';
import Parser from './processors/parser';
import Formatter from './processors/formatter';
import { parseArgs } from 'util';
import Expression from './types/expression';

/*=========================================================
    Functions
=========================================================*/

export function parse(pFormulaString: string): Expression {
  const scanner = new Scanner(pFormulaString);
  scanner.scanTokens();
  const parser = new Parser(scanner.Tokens);
  const results = parser.parse();
  return results;
}

export function format(pFormula: Expression) {
  const formatter = new Formatter(pFormula);
  return formatter.format();
}

async function init() {
  //Grab params
  const {values} = parseArgs({
    options: {
      help: {
        type: 'boolean',
        short: 'h'
      },
      inputDir: {
        type: 'string',
        short: 'i'
      },
      outputDir: {
        type: 'string',
        short: 'o'
      },
      format: {
        type: 'string',
        short: 'f',
        default: 'json'
      },
      pretty: {
        type: 'boolean',
        short: 'p'
      }
    },
    strict: true
  });
  //Validate args
  if(values.help) {
    console.log('Usage:');
    console.log('salesforce-formula-ast-generator --inputDir path/to/formula/file --outputDir path/to/json/output --format json');
    console.log('salesforce-formula-ast-generator --inputDir path/to/formula/file --outputDir path/to/formula/output --format formula');
    console.log('Use the --pretty [-p] flag when using JSON format for indentated outputs');
  } else if(!['json', 'formula'].includes(values.format?.toLowerCase())) {
    console.error('format [-f] must be "json" or "formula"');
    process.exit(1);
  } else {
    let output;
    const file = await fs.readFile(path.resolve(values.inputDir));
    const expr = parse(file.toString());
    if(values.format.toLowerCase() === 'formula') {
      output = format(expr);
    } else {
      output = JSON.stringify(expr, undefined, values.pretty && 2);
    }
    if(values.outputDir) {
      fs.writeFile(path.resolve(values.outputDir), output, 'utf-8');
    } else {
      console.log(output);
    }
  }
}

/*=========================================================
    Exports
=========================================================*/

if (require.main === module) {
  //Execute entry point
  init();
} else {
  //Export
  module.exports = {
    parse,
    format
  };
}