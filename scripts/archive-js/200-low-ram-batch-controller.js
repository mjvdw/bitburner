/** @param {import(".").NS} ns **/
export async function main(ns) {
  let target = ns.args[0];
  let server = ns.getServer().hostname;

  let maxThreads = Math.trunc(ns.getServerMaxRam(server) / 4);
  let offset = 200;

  // Prepare server.
  unlockServer(ns, target);

  let serverReady = false;
  while (!serverReady) {
    let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    if (freeRam > 10) {
      startBatch(ns, server, target, maxThreads, true);
    }

    serverReady = getServerStatus(ns, target);

    if (!serverReady) {
      await ns.sleep(1000);
    }
  }

  // Set up and run batches.
  while (true) {
    let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    if (freeRam >= 20) {
      startBatch(ns, server, target, maxThreads, false);
      await ns.sleep(1000);
    } else {
      await ns.sleep(2000);
    }
  }
}

function getServerStatus(ns, target) {
  let maxMoney = ns.getServerMaxMoney(target);
  let currentMoney = ns.getServerMoneyAvailable(target);
  let moneyReady = maxMoney == currentMoney;

  let minSecurity = ns.getServerMinSecurityLevel(target);
  let currentSecurity = ns.getServerSecurityLevel(target);
  let securityReady = minSecurity == currentSecurity;

  if (moneyReady && securityReady) {
    return true;
  } else {
    return false;
  }
}

function unlockServer(ns, target) {
  try {
    ns.brutessh(target);
  } catch (error) {
    ns.print(error);
  }

  try {
    ns.ftpcrack(target);
  } catch (error) {
    ns.print(error);
  }

  try {
    ns.relaysmtp(target);
  } catch (error) {
    ns.print(error);
  }

  try {
    ns.httpworm(target);
  } catch (error) {
    ns.print(error);
  }

  try {
    ns.sqlinject(target);
  } catch (error) {
    ns.print(error);
  }

  ns.nuke(target);
}

function startBatch(ns, server, target, threads, preparingServer) {
  ns.exec(
    "scripts/210-low-ram-batch.js",
    server,
    1,
    target,
    threads,
    preparingServer
  );
}
