import { mongoIdType } from "../../utils";

export { courtDecisionType };

type courtDecisionType = {
  date: Date;
  footer: string;
  header: string;
  _id: mongoIdType;
  metadata: string;
  oracleId: string;
  source: string;
  text: string;
};
