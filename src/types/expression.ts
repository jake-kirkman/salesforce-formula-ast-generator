import ExpressionType from "../enums/expression-type"

type Expression<T = ExpressionType> = {
  Type: T;
};
export default Expression;