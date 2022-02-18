/** @param {import(".").NS} ns **/
export async function main(ns: any) {
  ns.disableLog("scp");

  let debug = ns.args[0];

  if (debug) {
    await earn(ns);
  } else {
    while (true) {
      await earn(ns);
      await ns.sleep(60000);
    }
  }
}

async function earn(ns) {
  let server = ns.getServer();

  let pservLimit = ns.getPurchasedServerLimit();
  let maxServerRam =
    ns.getServerMaxRam(server.hostname) > ns.getPurchasedServerMaxRam()
      ? ns.getPurchasedServerMaxRam()
      : ns.getServerMaxRam(server.hostname);
  let maxServerCost = ns.getPurchasedServerCost(maxServerRam);
  let money = ns.getServerMoneyAvailable("home");
  let pservs = ns.getPurchasedServers();

  // Identify targets, in order of best to hack.
  let targets = getTargets(ns);

  // Make sure that "home" is hacking the one at the target
  // top of the list.
  let correctTarget = ns.isRunning(
    "/scripts/100-batch-controller.js",
    "home",
    targets[0].hostname
  );
  if (!correctTarget) {
    // Kill all scripts except this one.
    let currentScripts = ns.ps("home");
    let batchScripts = currentScripts.filter((s) => {
      return (
        s.filename != ns.getScriptName() && s.filename != "/scripts/999-sync.js"
      );
    });
    batchScripts.forEach((s) => {
      ns.kill(s.pid);
    });

    // Start with the correct one!
    ns.exec("/scripts/100-batch-controller.js", "home", 1, targets[0].hostname);
  }

  // Buy a maxed out server to hack other targets.
  if (money >= maxServerCost && pservs.length < pservLimit) {
    let i = pservs.length + 1;
    let suffix = "000";

    if (i < 10) {
      suffix = "00" + i.toString();
    } else if (i < 100) {
      suffix = "0" + i.toString();
    } else {
      suffix = i.toString();
    }

    let hostname = "pserv-" + suffix;
    ns.purchaseServer(hostname, ns.getPurchasedServerMaxRam());
  }

  // Starting hacking using purchased servers.
  // Get pservs again.
  pservs = ns.getPurchasedServers();
  let filteredPservs = pservs.filter((p) => p.startsWith("pserv-"));
  filteredPservs.sort();

  for (let n in filteredPservs) {
    let pserv = pservs[n];
    // Make sure pserv has the latest scripts.
    // Get scripts on home and on server.
    let homeScripts = ns.ls("home", "/scripts/");

    // Copy all scripts back to server.
    await ns.scp(homeScripts, pserv);
    let i = parseInt(pserv.split("-").pop());

    // This will be true if there are more targets than servers.
    // Outcome is to loop back around and use the remaining server
    // on the "top" option.
    if (!targets[i]) {
      i = 0;
    }

    let target = targets[i].hostname;

    let correctTarget = ns.isRunning(
      "/scripts/100-batch-controller.js",
      pserv,
      target
    );
    if (!correctTarget) {
      // Kill all scripts on the server.
      ns.killall(pserv);

      // Start with the correct one!
      ns.exec("/scripts/100-batch-controller.js", pserv, 1, target);
    }
  }
}

export function getTargets(ns) {
  // TODO: Having to cap infinite loop arbitrarily. Struggling
  // to get the scanQueue to remove a server once scanned.

  let targets = [];
  let scanQueue = [];
  let scanned = [];

  let levelOneTargets = ns.scan();
  levelOneTargets.forEach((t) => {
    let server = ns.getServer(t);
    if (!server.purchasedByPlayer && t !== "home" && t !== "darkweb") {
      targets.push(t);
      scanQueue.push(t);
    }
  });

  let i = 0;
  while (scanQueue.length > 0 && i < 30) {
    let results = [];

    scanQueue.forEach((t) => {
      let result = ns.scan(t);
      result.forEach((server) => {
        results.push(server);
      });
    });

    // Do something with results.
    let uniqueResults = [...new Set(results)];
    uniqueResults.forEach(async (r) => {
      if (r in scanned === false) {
        targets.push(r);
        scanQueue.push(r);
      }
    });
    i++;
  }

  let uniqueTargets = [...new Set(targets)];

  let targetServers = [];
  uniqueTargets.forEach((t) => {
    targetServers.push(ns.getServer(t));
  });

  let hackableTargets = getHackableTargets(ns, targetServers);
  let orderedTargets = getOrderedTargets(ns, hackableTargets);

  return orderedTargets;
}

function getHackableTargets(ns, targets) {
  // Conditions
  //	- Player hacking skill must be greater than skill required.
  //	- Max possible money must be greater than zero.

  let hackingSkill = ns.getHackingLevel();

  let portsCanOpen = 0;
  let portsScripts = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
  ];
  let files = ns.ls("home");

  for (let p in portsScripts) {
    if (files.includes(portsScripts[p])) {
      portsCanOpen++;
    }
  }

  let hackableTargets = targets.filter((t) => {
    let portsRequired = ns.getServerNumPortsRequired(t.hostname);

    return (
      hackingSkill >= t.requiredHackingSkill &&
      ns.getServerMaxMoney(t.hostname) > 0 &&
      portsCanOpen >= portsRequired
    );
  });

  return hackableTargets;
}

function getOrderedTargets(ns, hackableTargets) {
  // Score is the maximum dollars per second.
  // This is not the same rate that will be effected in
  // practice, as this would drain the server of all money.

  let scoredTargets = [];

  hackableTargets.forEach((h) => {
    let maxMoney = ns.getServerMaxMoney(h.hostname);
    // let batchTime = ns.getWeakenTime(h.hostname) + 1000; // Weaken always takes longest.
    // let score = maxMoney / batchTime;
    scoredTargets.push({
      hostname: h.hostname,
      // score: score,
      money: maxMoney,
    });
  });

  let orderedTargets = scoredTargets.sort((a, b) => {
    // return b.score - a.score;
    return b.money - a.money;
  });

  let orderedTargetServers = [];
  orderedTargets.forEach((o) => {
    orderedTargetServers.push(ns.getServer(o.hostname));
  });

  return orderedTargets;
}
