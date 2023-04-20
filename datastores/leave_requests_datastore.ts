import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const LeaveRequestsDatastore = DefineDatastore({
  name: "leave_requests",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    manager: { type: Schema.slack.types.user_id },
    requester: { type: Schema.slack.types.user_id },
    start_date: { type: Schema.types.string },
    end_date: { type: Schema.types.string },
    reason: { type: Schema.types.string },
  },
});
