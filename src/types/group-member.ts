import Token from "../classes/token";
import ExpressionType from "../enums/expression-type";
import Expression from "./expression";

type GroupMember = Expression<ExpressionType.GROUPMEMBER> & {
  Connector: Token;
  Value: Expression;
}
export default GroupMember;