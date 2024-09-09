import Token from "../classes/token";
import ExpressionType from "../enums/expression-type";
import Expression from "./expression";

type Binary = Expression<ExpressionType.BINARY> & {
  Left: Expression;
  Operator: Token;
  Right: Expression;
}
export default Binary;