import ExpressionType from "../enums/expression-type";
import Expression from "./expression";
import GroupMember from "./group-member";

type Grouping = Expression<ExpressionType.GROUPING> & {
  Members: GroupMember[];
  Wrapped: boolean;
};
export default Grouping;