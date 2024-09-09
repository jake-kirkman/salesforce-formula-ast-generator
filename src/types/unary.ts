import Token from "../classes/token";
import ExpressionType from "../enums/expression-type";
import Expression from "./expression";

type Unary = Expression<ExpressionType.UNARY> & {
  Operator: Token;
  Right: Expression;
}
export default Unary;