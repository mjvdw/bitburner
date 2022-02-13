/** @param {import(".").NS} ns **/

import { getTargets } from "scripts/000-master-controller.js";

export async function main(ns) {
  let server = ns.args[0] || "home";
  let target = ns.args[1] || undefined;

  let scripts = ns.ps(server);

  let targets = [];
  if (!target) {
    targets = getTargets(ns);
  } else {
    targets.push(target);
  }

  // Print Headers
  let columnWidth = 22;
  let serverHeader = "SERVER";
  let moneyHeader = "MONEY";
  let securityHeader = "SECURITY";
  ns.tprint(
    serverHeader +
      " ".repeat(columnWidth - serverHeader.length) +
      moneyHeader +
      " ".repeat(columnWidth - moneyHeader.length) +
      securityHeader
  );

  // Print Content
  targets.forEach((t) => {
    let target = ns.getServer(t.hostname);
    prettyPrint(ns, target, columnWidth);
  });
  ns.tprint("-".repeat(columnWidth * 3));
}

function prettyPrint(ns, target, columnWidth) {
  ns.tprint("-".repeat(columnWidth * 3));
  let hostname = target.hostname;

  let availableMoney = ns.nFormat(target.moneyAvailable, "($0.00a)");
  let maxMoney = ns.nFormat(target.moneyMax, "($0.00a)");
  let money = availableMoney + " / " + maxMoney;

  let currentSecurity = ns.nFormat(target.hackDifficulty, "0,0");
  let minSecurity = ns.nFormat(target.minDifficulty, "0,0");
  let security = currentSecurity + " / " + minSecurity;

  ns.tprint(
    hostname +
      " ".repeat(columnWidth - hostname.length) +
      money +
      " ".repeat(columnWidth - money.length) +
      security
  );
}
