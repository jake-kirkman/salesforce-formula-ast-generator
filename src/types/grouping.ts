import Token from "../classes/token";
import ExpressionType from "../enums/expression-type";
import Expression from "./expression";
import GroupMember from "./group-member";

type Grouping = Expression<ExpressionType.GROUPING> & {
  Members: GroupMember[];
  LeftBracket: Token;
  RightBracket: Token;
  Wrapped: boolean;
};
export default Grouping;