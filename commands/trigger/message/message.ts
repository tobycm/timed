import triggerCommand from "../trigger";

const messageTriggerSubcommandGroup = triggerCommand.addSubcommandGroup(
  (group) => group.setName("message").setDescription("Add a message trigger")
);

export default messageTriggerSubcommandGroup;
