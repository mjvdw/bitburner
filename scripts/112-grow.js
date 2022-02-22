/** @param {import(".").NS} ns **/
export async function main(ns) {
  let target = ns.args[0];
  await ns.grow(target);

  let currentMoney = ns.getServerMoneyAvailable(target);
  let maxMoney = ns.getServerMaxMoney(target);

  ns.tprint(
    ns.nFormat(Math.trunc(currentMoney), "$0.000a") +
      " / " +
      ns.nFormat(maxMoney, "$0.000a") +
      " (" +
      ns.nFormat((currentMoney / maxMoney) * 100, "0.0000") +
      "%)"
  );
  // ns.tprint(ns.getScriptLogs());
}
