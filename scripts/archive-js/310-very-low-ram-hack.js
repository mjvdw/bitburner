/** @param {import(".").NS} ns **/
export async function main(ns) {
  let target = ns.args[0];

  while (true) {
    ns.exec(
      "scripts/210-low-ram-batch.js",
      "home",
      1,
      target,
      32,
      getPreparingServer(ns, target)
    );
    let wait = ns.getWeakenTime(target);
    await ns.sleep(wait + 1000);
  }
}

function getPreparingServer(ns, target) {
  let maxMoney = ns.getServerMaxMoney(target);
  let currentMoney = ns.getServerMoneyAvailable(target);
  let moneyReady = maxMoney == currentMoney;

  let minSecurity = ns.getServerMinSecurityLevel(target);
  let currentSecurity = ns.getServerSecurityLevel(target);
  let securityReady = minSecurity == currentSecurity;

  if (moneyReady && securityReady) {
    return false;
  } else {
    return true;
  }
}
