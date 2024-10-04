/*=========================================================
    Imports
=========================================================*/

import { initAction, initBinary, initGrouping, initGroupMember, initIdentifier, initLiteral, initUnary } from "../util/expressions";
import Token from "../classes/token";
import KEYWORDS from "../constants/functions";
import TokenType from "../enums/token-type";
import Expression from "../types/expression";
import { error, report } from "../util/utility";

/*=========================================================
    Classes
=========================================================*/

export default class Parser {

  //Vars
  Tokens: Token[];
  Current: number;

  //Constructor
  constructor(pTokens: Token[]) {
    this.Tokens = pTokens;
    this.Current = 0;
  }

  //Functions
  parse(): Expression {
    return this._handleExpression();
  }

  //Expressions
  _handleExpression() {
    let expr = this._handleEquality();

    //Check for &&/||
    const values = [initGroupMember(undefined, expr)];
    while(this._match(TokenType.AMBERSAND_AMBERSAND, TokenType.PIPE_PIPE)) {
      values.push(initGroupMember(this._previous(), this._handleEquality()));
    }
    if(values.length > 1) {
      expr = initGrouping(values);
    }

    return expr;
  }
  _handleEquality() {
    let expr = this._handleComparison();
    
    while(this._match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL, TokenType.EQUAL, TokenType.GREATER_LESS_NOT_EQUAL)) {
      const operator = this._previous();
      const right = this._handleComparison();
      expr = initBinary(expr, operator, right);
    }

    return expr;
  }
  _handleComparison() {
    let expr = this._handleTerm();

    while(this._match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this._previous();
      const right = this._handleTerm();
      expr = initBinary(expr, operator, right);
    }

    return expr;
  }
  _handleTerm() {
    let expr = this._handleFactor();

    while(this._match(TokenType.PLUS, TokenType.MINUS, TokenType.AMBERSAND, TokenType.EXPONENTIATION)) {
      const operator = this._previous();
      const right = this._handleFactor();
      expr = initBinary(expr, operator, right);
    }

    return expr;
  }
  _handleFactor() {
    let expr = this._handleUnary();

    while(this._match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this._previous();
      const right = this._handleUnary();
      expr = initBinary(expr, operator, right);
    }

    return expr;
  }
  _handleUnary() {
    if(this._match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this._previous();
      const right = this._handleUnary();
      return initUnary(operator, right);
    }

    return this._handlePrimary();
  }
  _handlePrimary() {
    if(this._match(TokenType.FALSE)) return initLiteral(this._previous(), false);
    if(this._match(TokenType.TRUE)) return initLiteral(this._previous(), true);
    if(this._match(TokenType.NUMBER, TokenType.STRING)) return initLiteral(this._previous());

    if(this._match(TokenType.LEFT_PAREN)) {
      const leftBracket = this._previous();
      const values = [];
      if(!this._match(TokenType.RIGHT_PAREN)) {
        values.push(initGroupMember(undefined, this._handleExpression()));
        while(this._match(TokenType.COMMA)) {
          values.push(initGroupMember(this._previous(), this._handleExpression()));
        }
        this._consume(TokenType.RIGHT_PAREN, 'Expected ) after expression');
      }
      return initGrouping(values, leftBracket, this._previous());
    }

    if(this._match(...Object.values(KEYWORDS))) {
      const func = this._previous();
      const expr = this._handlePrimary();
      return initAction(func, expr);
    }

    if(this._match(TokenType.IDENTIFIER)) {
      const values = [this._previous()];
      while(this._match(TokenType.DOT)) {
        values.push(this._advance());
      }
      return initIdentifier(values);
    }

    this._error(this._peek(), 'Unknown Token');
  }

  //Helper Functions
  _match(...pTypes: TokenType[]) {
    for(const type of pTypes) {
      if(this._check(type)) {
        this._advance();
        return true;
      }
    }
    return false;
  }
  _check(pType: TokenType) {
    if(this._isAtEnd()) return false;
    return this._peek().Type === pType;
  }
  _advance() {
    if(!this._isAtEnd()) this.Current++;
    return this._previous();
  }
  _isAtEnd() {
    return this._peek().Type === TokenType.EOF;
  }
  _peek() {
    return this.Tokens[this.Current];
  }
  _previous() {
    return this.Tokens[this.Current - 1];
  }
  _consume(pType: TokenType, pMessage: string) {
    if(this._check(pType)) return this._advance();
    this._error(this._peek(), pMessage);
  }
  _error(pToken: Token, pMessage: string) {
    if(pToken.Type === TokenType.EOF) {
      report(pToken.Line, ` at end`, pMessage);
    } else {
      report(pToken.Line, ` at "${pToken.Lexeme}"`, pMessage);
    }
  }

}