/** @param {import(".").NS} ns **/
export async function main(ns) {
  let target = ns.args[0];
  await ns.hack(target);
  // ns.tprint(ns.getScriptLogs());
}