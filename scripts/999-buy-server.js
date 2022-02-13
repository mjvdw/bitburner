/** @param {import(".").NS} ns **/
export async function main(ns) {
  const name = ns.args[0];
  const ram = ns.args[1];

  let server = ns.purchaseServer(name, ram);

  if (server) {
    const scripts = ns.ls("home", "scripts/");
    await ns.scp(scripts, name);
  } else {
    ns.alert("Something went wrong purchasing this server.");
  }
}
