export const checkUser = async (ctx) => {
  const member = await ctx.api.getChatMember("@fulstack_dev", ctx.from.id);

  if (member.status == "left") {
    return false;
  } else {
    return true;
  }
};
