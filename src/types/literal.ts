import ExpressionType from "../enums/expression-type";
import Expression from "./expression";

type Literal = Expression<ExpressionType.LITERAL> & {
  Value: string | number | boolean;
};
export default Literal;