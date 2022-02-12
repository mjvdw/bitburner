/** @param {import(".").NS} ns **/
export async function main(ns) {
  let debug = ns.args[0];

  if (debug) {
    await earn(ns);
  } else {
    while (true) {
      await earn(ns);
      await ns.sleep(10000);
    }
  }
}

async function earn(ns) {
  let pservLimit = ns.getPurchasedServerLimit();
  let maxServerRam = ns.getPurchasedServerMaxRam();
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
      return s.filename != ns.getScriptName();
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
  await pservs.forEach(async (p) => {
    // Make sure pserv has the latest scripts.
    await updateScriptsOnServer(ns, p);

    let i = parseInt(p.split("-").pop());
    let correctTarget = ns.isRunning(
      "/scripts/100-batch-controller.js",
      p,
      targets[i].hostname
    );
    if (!correctTarget) {
      // Kill all scripts on the server.
      ns.killall(p);

      // Start with the correct one!
      ns.exec("/scripts/100-batch-controller.js", p, 1, targets[i].hostname);
    }
  });
}

function getTargets(ns) {
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

  let hackableTargets = targets.filter((t) => {
    return (
      hackingSkill >= t.requiredHackingSkill &&
      ns.getServerMaxMoney(t.hostname) > 0
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
    let batchTime = ns.getWeakenTime(h.hostname) + 1000; // Weaken always takes longest.
    let score = maxMoney / batchTime;
    scoredTargets.push({
      hostname: h.hostname,
      score: score,
    });
  });

  let orderedTargets = scoredTargets.sort((a, b) => {
    return b.score - a.score;
  });

  let orderedTargetServers = [];
  orderedTargets.forEach((o) => {
    orderedTargetServers.push(ns.getServer(o.hostname));
  });

  return orderedTargets;
}

async function updateScriptsOnServer(ns, server) {
  // Get scripts on home and on server.
  let homeScripts = ns.ls("home", "/scripts/");
  let serverScripts = ns.ls(server, "/scripts/");

  // Just delete everything and start again.
  serverScripts.forEach((f) => {
    ns.rm(f);
  });

  // Copy all scripts back to server.
  let copied = await ns.scp(homeScripts, server);
}
