/*=========================================================
    Imports
=========================================================*/

import Token from "../classes/token";
import KEYWORDS from "../constants/functions";
import TokenType from "../enums/token-type";
import { error } from "../util/utility";

/*=========================================================
    Class
=========================================================*/

export default class Scanner {
  //Vars
  Source: string;
  Tokens: Token[];

  //File Vars
  Start: number;
  Current: number;
  Line: number;

  //Constructor
  constructor(pSource: string) {
    this.Source = pSource;
    this.Tokens = [];
    this.Start = 0;
    this.Current = 0;
    this.Line = 1;
  }

  //Entry point
  scanTokens() {
    //Main loop
    while(!this._isAtEnd()) {
      this.Start = this.Current;
      this._scanToken();
    }

    //Add end of file
    this.Tokens.push(new Token(TokenType.EOF, "", undefined, this.Line, undefined, undefined));
  }

  _scanToken() {
    const char = this._advance();
    switch(char) {
      case '(': 
        this._addToken(TokenType.LEFT_PAREN);
        break;
      case ')': 
        this._addToken(TokenType.RIGHT_PAREN);
        break;
      case ',': 
        this._addToken(TokenType.COMMA);
        break;
      case '.': 
        this._addToken(TokenType.DOT);
        break;
      case '-': 
        this._addToken(TokenType.MINUS);
        break;
      case '+': 
        this._addToken(TokenType.PLUS);
        break;
      case '/': 
        this._addToken(TokenType.SLASH); //No need to worry about comments
        break;
      case '*': 
        this._addToken(TokenType.STAR);
        break;
      case '^': 
        this._addToken(TokenType.EXPONENTIATION);
        break;
      case '!': 
        this._addToken(this._match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=': 
        this._addToken(this._match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<': 
        if(this._match('=')) {
          this._addToken(TokenType.LESS_EQUAL);
        } else if(this._match('>')) {
          this._addToken(TokenType.GREATER_LESS_NOT_EQUAL);
        } else {
          this._addToken(TokenType.LESS);
        }
        break;
      case '>': 
        this._addToken(this._match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '&': 
        this._addToken(this._match('&') ? TokenType.AMBERSAND_AMBERSAND : TokenType.AMBERSAND);
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;
      case '\n':
        this.Line++;
        break;
      case '\'':
      case '"':
        this._handleString();
        break;
      default:
        if(this._isDigit(char)) {
          this._handleNumber();
        } else if(this._isAlpha(char)) {
          this._handleIdentifier();
        } else if(this._match('|')) {
          this._addToken(TokenType.PIPE_PIPE);
        } else {
          error(this.Line, 'Unexpected Character: ' + char);
        }
        break;
    }
  }

  //Helper methods
  _isAtEnd(): boolean {
    return this.Current >= this.Source.length
  }
  _handleString(): void {
    while (!['\'', '"'].includes(this._peek()) && !this._isAtEnd()) {
      this._advance();
    }

    if(this._isAtEnd()) {
      error(this.Line, 'Unterminated string');
      return;
    }

    //The closing tag
    this._advance();

    //Trim surrounding quotes
    const value = this.Source.substring(this.Start + 1, this.Current - 1);
    this._addToken(TokenType.STRING, value);
  }
  _handleNumber(): void {
    while(this._isDigit(this._peek())) {
      this._advance();
    }

    if(this._peek() === '.' && this._isDigit(this._peekNext())) {
      //Consume '.'
      this._advance();

      //Consume decimals
      while(this._isDigit(this._peek())) {
        this._advance();
      }
    }

    this._addToken(
      TokenType.NUMBER, 
      parseFloat(
        this.Source.substring(
          this.Start, 
          this.Current
        )
      )
    );
  }
  _handleIdentifier(): void {
    while (this._isAlphaNumeric(this._peek())) {
      this._advance();
    } 

    const text = this.Source.substring(this.Start, this.Current).toUpperCase();
    let type = KEYWORDS[text];
    if(type === undefined) type = TokenType.IDENTIFIER;
    this._addToken(type);
  }
  _isDigit(pNumber: string): boolean {
    return !isNaN(parseInt(pNumber));
  }
  _isAlpha(pChar: string): boolean {
    return (
      (pChar >= 'a' && pChar <= 'z') ||
      (pChar >= 'A' && pChar <= 'Z') ||
      pChar === '_' || 
      pChar === '$' ||
      pChar === '{' ||
      pChar === '}' ||
      pChar === '!'

    );
  }
  _isAlphaNumeric(pChar: string): boolean {
    return this._isAlpha(pChar) || this._isDigit(pChar);
  }
  _advance(): string {
    const char = this.Source.charAt(this.Current++);
    return char;
  }
  _match(pExpected: string): boolean {
    if (this._isAtEnd()) return false;
    if (this.Source.charAt(this.Current) != pExpected) return false;

    this.Current++;
    return true;
  }
  _peek(): string {
    if(this._isAtEnd()) return '\0';
    return this.Source.charAt(this.Current)
  }
  _peekNext(): string {
    if (this.Current + 1 >= this.Source.length) return '\0';
    return this.Source.charAt(this.Current + 1);
  }
  _addToken(pType: TokenType, pLiteral?: any): void {
    const text = this.Source.substring(this.Start, this.Current);
    this.Tokens.push(new Token(pType, text, pLiteral, this.Line, this.Start, this.Current));
  }

}