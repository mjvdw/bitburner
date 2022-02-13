/** @param {import(".").NS} ns **/
export async function main(ns) {
  let target = ns.args[0];
  let success = ns.deleteServer(target);

  if (success) {
    ns.tprint("Deleted " + target);
  } else {
    ns.alert("Failed to delete " + target);
  }
}
