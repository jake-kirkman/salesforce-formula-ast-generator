import Token from "../classes/token";
import ExpressionType from "../enums/expression-type";
import Expression from "./expression";

type Action = Expression<ExpressionType.ACTION> & {
  Token: Token;
  Parameters: Expression;
}
export default Action;