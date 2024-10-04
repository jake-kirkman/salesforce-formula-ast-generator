/*=========================================================
    Imports
=========================================================*/

import ExpressionType from "../enums/expression-type";
import Action from "../types/action";
import Binary from "../types/binary";
import Expression from "../types/expression";
import GroupMember from "../types/group-member";
import Grouping from "../types/grouping";
import Identifier from "../types/identifier";
import Literal from "../types/literal";
import Unary from "../types/unary";
import Token from "../classes/token";

/*=========================================================
    Exports
=========================================================*/

export function initBinary(pLeft: Expression, pOperator: Token, pRight: Expression): Binary {
  return {
    Type: ExpressionType.BINARY,
    Left: pLeft,
    Operator: pOperator,
    Right: pRight
  };
}
export function initUnary(pOperator: Token, pRight: Expression): Unary {
  return {
    Type: ExpressionType.UNARY,
    Operator: pOperator,
    Right: pRight
  };
}
export function initLiteral(pToken: Token, pValue?: string | number | boolean): Literal {
  return {
    Type: ExpressionType.LITERAL,
    Value: pValue || pToken.Literal,
    Token: pToken
  };
}
export function initGrouping(pMembers: GroupMember[], pLeftBracket?: Token, pRightBracket?: Token): Grouping {
  return {
    Type: ExpressionType.GROUPING,
    Members: pMembers,
    LeftBracket: pLeftBracket,
    RightBracket: pRightBracket,
    Wrapped: pLeftBracket !== undefined
  }
}
export function initGroupMember(pConnector: Token, pValue: Expression): GroupMember {
  return {
    Type: ExpressionType.GROUPMEMBER,
    Connector: pConnector,
    Value: pValue
  }
}
export function initAction(pToken: Token, pParameters: Expression): Action {
  return {
    Type: ExpressionType.ACTION,
    Token: pToken,
    Parameters: pParameters
  }
}
export function initIdentifier(pParts: Token[]): Identifier {
  return {
    Type: ExpressionType.IDENTIFIER,
    Parts: pParts,
    Value: pParts.map(pPart => pPart.Lexeme).join('.')
  }
}
