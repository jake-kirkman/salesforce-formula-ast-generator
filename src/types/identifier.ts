import Token from "../classes/token";
import ExpressionType from "../enums/expression-type";
import Expression from "./expression";

type Identifier = Expression<ExpressionType.IDENTIFIER> & {
  Parts: Token[];
  Value: string;
}
export default Identifier;