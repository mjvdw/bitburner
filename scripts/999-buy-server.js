/** @param {import(".").NS} ns **/
export async function main(ns) {
  const name = ns.args[0];
  const ram = ns.args[1];
  ns.purchaseServer(name, ram);

  const scripts = ns.ls("home", "scripts/");
  await ns.scp(scripts, name);
}
