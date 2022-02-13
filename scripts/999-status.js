/** @param {import(".").NS} ns **/
export async function main(ns) {
  let server = ns.args[0] || "home";
  let target = ns.args[1] || undefined;

  let scripts = ns.ps(server);
}
