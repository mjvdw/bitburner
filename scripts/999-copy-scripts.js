/** @param {import(".").NS} ns **/
export async function main(ns) {
  const name = ns.args[0];
  const scripts = ns.ls("home", "scripts/");
  await ns.scp(scripts, name);
}
