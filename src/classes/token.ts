/*=========================================================
    Imports
=========================================================*/

import TokenType from "../enums/token-type"

/*=========================================================
    Exports
=========================================================*/

export default class Token {

  //Vars
  Type: TokenType;
  Lexeme: string;
  Literal: any;
  Line: number;
  Start: number;
  End: number;

  //Constructor
  constructor(pType: TokenType, pLexeme: string, pLiteral: any, pLine: number, pStart: number, pEnd: number) {
    this.Type = pType;
    this.Lexeme = pLexeme;
    this.Literal = pLiteral;
    this.Line = pLine;
    this.Start = pStart;
    this.End = pEnd;
  }

  //Vars
  toString(): string {
    return `${this.Type} ${this.Lexeme || ''} ${this.Literal || ''}`;
  }

}