import { Manifest } from "deno-slack-sdk/mod.ts";
import { LeaveRequestsDatastore } from "./datastores/leave_requests_datastore.ts";
import CreateFTOWorkflow from "./workflows/request_fto_workflow.ts";

// Manage app settings
export default Manifest({
  name: "simple-fto",
  description: "Request and manage flexible time off",
  icon: "assets/default_new_app_icon.png",
  workflows: [CreateFTOWorkflow],
  datastores: [LeaveRequestsDatastore],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
