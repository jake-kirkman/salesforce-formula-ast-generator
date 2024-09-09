# Salesforce Formula AST Parser

This is a tool to parse and understand Salesforce formulas and break them down into an Abstract Syntax Tree which is easier for programs to understand and makes it easier to modify, read and edit Salesforce formulas.

There is also a formatter included which essentially just adds a new line for each group member, and increments based on the level of brackets. Very primitive but it helps when there is a very messy formula you just want to read.

# Usage

## Command Line
For outputting the AST as a JSON

```shell
salesforce-formula-ast-generator --inputDir path/to/formula/file --outputDir path/to/json/output --format json
salesforce-formula-ast-generator --inputDir path/to/formula/file --outputDir path/to/json/output --format json --pretty
```

For outputting the AST as a formatted formula

```shell
salesforce-formula-ast-generator --inputDir path/to/formula/file --outputDir path/to/formula/output --format formula
```

## NodeJS
Or within a Node package:
```javascript
import {parse} from 'salesforce-formula-ast-generator';
//...
const expr = parse('AND(myField__c == myOtherField__c, totalChildRecords__c >= 5)');
```

# Types and Tokens

View the source in GitHub and view the types here:
- Expression Types: `./src/enums/expression-type.ts`
- Token Types: `./src/enums/token-type.ts`