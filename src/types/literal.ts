import Token from "../classes/token";
import ExpressionType from "../enums/expression-type";
import Expression from "./expression";

type Literal = Expression<ExpressionType.LITERAL> & {
  Value: string | number | boolean;
  Token: Token;
};
export default Literal;