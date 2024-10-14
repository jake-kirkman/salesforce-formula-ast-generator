/*=========================================================
    Imports
=========================================================*/

import ExpressionType from "../enums/expression-type";
import TokenType from "../enums/token-type";
import Action from "../types/action";
import Binary from "../types/binary";
import Expression from "../types/expression";
import FormattingOptions from "../types/formatting-options";
import Grouping from "../types/grouping";
import Identifier from "../types/identifier";
import Literal from "../types/literal";
import Unary from "../types/unary";

/*=========================================================
    Exports
=========================================================*/

export default class Formatter {

  //Vars
  Expr: Expression;
  Output: string;
  Indent: number;
  UseTabs: Boolean;
  NumOfSpaces: number;

  //Constructor
  constructor(pExpr: Expression, pFormattingOptions?: FormattingOptions) {
    this.Expr = pExpr;
    this.Output = '';
    this.Indent = 0;
    this.UseTabs = pFormattingOptions?.useTabs || false;
    this.NumOfSpaces = pFormattingOptions?.spaces || 2;
  }

  //Functions
  format() {
    try {
      this._handleExpression(this.Expr);
      return this.Output;
    } catch(ex) {
      console.error(ex);
      return '';
    }
  }

  //Helpers
  _handleExpression(pExpr: Expression) {
    switch(pExpr.Type) {
      case ExpressionType.GROUPING:
        this._convertGrouping(pExpr as Grouping);
        break;
      case ExpressionType.BINARY:
        this._convertBinary(pExpr as Binary);
        break;
      case ExpressionType.UNARY:
        this._convertUnary(pExpr as Unary);
        break;
      case ExpressionType.ACTION:
        this._convertAction(pExpr as Action);
        break;
      case ExpressionType.IDENTIFIER:
        this._append(String((pExpr as Identifier).Value));
        break;
      case ExpressionType.LITERAL:
        if(typeof (pExpr as Literal).Value === 'string') {
          this._append(`"${(pExpr as Literal).Value}"`);
        } else {
          this._append(String((pExpr as Literal).Value));
        }
        break;
      case ExpressionType.GROUPMEMBER:
      default:
        console.error('Unexpected type: ' + pExpr.Type);
    }
  }
  _convertUnary(pExpr: Unary) {
    this._append(pExpr.Operator.Lexeme);
    this._handleExpression(pExpr.Right);
  }
  _convertBinary(pExpr: Binary) {
    this._handleExpression(pExpr.Left);
    this._append(' ' + pExpr.Operator.Lexeme + ' ');
    this._handleExpression(pExpr.Right);
  }
  _convertAction(pExpr: Action) {
    this._append(pExpr.Token.Lexeme);
    this._handleExpression(pExpr.Parameters);
  }
  _convertGrouping(pExpr: Grouping) {
    if(pExpr.Members.length > 0) {
      if(pExpr.Wrapped) {
        this._append('(');
        this._addLine(1);
      }
      for(const groupMember of pExpr.Members) {
        if(groupMember.Connector?.Type === TokenType.COMMA) {
          this._append(groupMember.Connector.Lexeme);
          this._addLine();
        } else if(groupMember.Connector !== undefined) {
          this._addLine();
          this._append(groupMember.Connector.Lexeme + ' ');
        }
        this._handleExpression(groupMember.Value);
      }
      if(pExpr.Wrapped) {
        this._addLine(-1);
        this._append(')');
      }
    } else if(pExpr.Wrapped) {
      this._append('()');
    }
  }

  _addLine(pIndent?: 1 | -1) {
    if(pIndent === 1) {
      this.Indent++;
    } else if(pIndent === -1) {
      this.Indent--;
    }
    this.Output += '\n' + this._buildIndentation().repeat(this.Indent);
  }
  _buildIndentation() {
    if(this.UseTabs) {
      return '\t';
    } else {
      return ' '.repeat(this.NumOfSpaces);
    }
  }
  _append(pMessage: string) {
    this.Output += pMessage;
  }

}