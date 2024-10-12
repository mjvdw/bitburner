/** @param {import(".").NS} ns */

import {
  updateReservedRam,
  getReservedRamState,
  getReservedRamForServer,
  reserveRam,
  releaseRam,
  resetReservedRamForServer,
  getAllAugmentations,
  buyFromDarkweb,
  getUnownedAugmentationsForFaction,
  getOwnedAugmentationsForFaction,
  FACTIONS,
  directConnect,
  getReputationForDonations,
  isWorkingForFaction,
  updateFactionWorking,
  getPortCurrentState,
  PORTS,
  unlockTarget,
  // @ts-ignore
} from "/scripts/library/utils.js";

import {
  criteria,
  // @ts-ignore
} from "/scripts/library/faction-criteria.js";

const HACK_SCRIPT = "/scripts/library/hack.js";
const GROW_SCRIPT = "/scripts/library/grow.js";
const WEAKEN_SCRIPT = "/scripts/library/weaken.js";
export async function main(ns: any) {
  ns.disableLog("ALL");
  ns.clearLog();

  const worker = ns.getServer().hostname;
  const singleTarget = ns.args[0];

  // if (worker == "home") {
  //     const pservs = ns.getPurchasedServers()
  //     // const pservs = ["pserv-001"]
  //     for (let pserv of pservs) {
  //         ns.exec("/scripts/workers/edward.js", pserv, 1)
  //         await ns.sleep(1000)
  //     }
  // }

  let targets: any = {};

  if (singleTarget) {
    targets[singleTarget] = {
      nextAction: "INIT",
      msDone: 0,
      hackPercent: 90,
    };
  } else {
    getServerNames(ns)
      .filter(
        (hostname) =>
          ns.getServerRequiredHackingLevel(hostname) <= ns.getHackingLevel(),
      )
      .forEach((hostname) => {
        if (
          ns.getServerMaxMoney(hostname) > 0 &&
          ns.getServerGrowth(hostname) > 1
        ) {
          targets[hostname] = {
            nextAction: "INIT",
            msDone: 0,
            hackPercent: 90,
          };
        }
      });
  }

  await hackLoop(ns, worker, targets);
}

async function hackLoop(ns: any, worker: string, targets: any[]) {
  const updateInterval = 500;

  while (true) {
    await ns.sleep(updateInterval);

    for (const [target, meta] of Object.entries(targets)) {
      let unlocked = unlockTarget(ns, target);
      meta.msDone -= updateInterval;

      if (meta.msDone < 0 && unlocked) {
        if (meta.nextAction === "INIT") {
          init(target, meta);
        } else if (meta.nextAction === "WEAKEN") {
          weaken(target, meta);
        } else if (meta.nextAction === "GROW") {
          grow(target, meta);
        } else if (meta.nextAction === "HACK") {
          hack(target, meta);
        }
      }
    }
  }

  function init(target: any, meta: any) {
    log(ns, `exec ${meta.nextAction} on ${target}`);
    meta.raisedSecurityLevel =
      ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
    log(ns, `initial weaken of ${target} ${meta.raisedSecurityLevel}`);
    meta.nextAction = "WEAKEN";
  }

  function weaken(target: any, meta: any) {
    log(ns, `exec ${meta.nextAction} on ${target}`);

    let weakenThreads = 0;
    while (ns.weakenAnalyze(weakenThreads++, 1) <= meta.raisedSecurityLevel) {}
    log(
      ns,
      `weakening with ${weakenThreads} threads (${millisecondsToString(ns.getWeakenTime(target))})`,
    );
    const wait = attack(ns, "weaken", worker, target, weakenThreads);
    if (wait >= 0) {
      meta.msDone = wait;
      meta.raisedSecurityLevel = 0;
      meta.nextAction = "GROW";
    }
  }

  function grow(target: any, meta: any) {
    log(ns, `exec ${meta.nextAction} on ${target}`);

    const growThreads = calcNumberOfThreadsToGrowToMax(target);
    if (growThreads > 0) {
      log(
        ns,
        `growing with ${growThreads} threads (${millisecondsToString(ns.getGrowTime(target))})`,
      );
      const wait = attack(ns, "grow", worker, target, growThreads);
      if (wait >= 0) {
        meta.msDone = wait;
        meta.raisedSecurityLevel += ns.growthAnalyzeSecurity(growThreads);
        meta.nextAction = "HACK";
      }
    } else {
      meta.msDone = 0;
      meta.nextAction = "HACK";
    }

    function calcNumberOfThreadsToGrowToMax(target: any) {
      const maxMoney = ns.getServerMaxMoney(target);
      const availableMoney = ns.getServerMoneyAvailable(target);
      const alpha = availableMoney > 0 ? 1 / (availableMoney / maxMoney) : 100;
      return Math.round(ns.growthAnalyze(target, alpha, 1));
    }
  }

  function hack(target: any, meta: any) {
    log(ns, `exec ${meta.nextAction} on ${target}`);

    const partHackableMoney = ns.hackAnalyze(target);
    const hackThreads = Math.floor(
      1 / partHackableMoney / (100 / meta.hackPercent),
    );
    ns.print(
      `hacking with ${hackThreads} threads (${millisecondsToString(ns.getHackTime(target))})`,
    );
    const wait = attack(ns, "hack", worker, target, hackThreads);
    if (wait >= 0) {
      meta.msDone = wait;
      meta.raisedSecurityLevel += ns.hackAnalyzeSecurity(hackThreads);
      meta.nextAction = "WEAKEN";
    }
  }
}

function attack(
  ns: any,
  type: string,
  worker: string,
  target: any,
  maxThreads: number,
) {
  let wait = 0;

  let scriptName;

  if (type === "hack") {
    wait = ns.getHackTime(target);
    scriptName = HACK_SCRIPT;
  } else if (type === "grow") {
    wait = ns.getGrowTime(target);
    scriptName = GROW_SCRIPT;
  } else if (type === "weaken") {
    wait = ns.getWeakenTime(target);
    scriptName = WEAKEN_SCRIPT;
  } else {
    throw Error(`UNKNOWN TYPE: ${type}`);
  }
  const maxThreadsRam = calcMaxThreadsRam(scriptName);
  let threads = Math.min(maxThreads, maxThreadsRam);
  threads = threads > 0 ? threads : 1;

  log(ns, `ns.exec ${scriptName} ${worker} ${threads} ${target} ${wait}`);
  if (ns.exec(scriptName, worker, threads, target) === 0) {
    log(ns, `Could not exec ${scriptName} on ${worker}. Ram full? Root?`);
    return -1;
  }

  return wait;

  function calcMaxThreadsRam(script: any) {
    const freeRam = ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker);
    return Math.floor(freeRam / ns.getScriptRam(script, worker));
  }
}

/**
 *
 * HELPER FUNCTIONS ONLY
 *
 */

export function autocomplete(data: any, args: any[]) {
  return [...data.servers]; // This script autocompletes the list of servers.
}

function log(ns: any, message: string) {
  ns.print(`${new Date().toLocaleTimeString()} ${message}`);
}

export function getServerNames(ns: any) {
  return getServers(ns).map((s) => {
    return s.hostname;
  });
}

export function getServers(ns: any) {
  return [...recurseServers()].filter((s) => {
    return s.hostname != "darkweb";
  });

  /**
   * @generator Traverses the connection tree in pre-order
   * @param fn Function called on each server
   * @param current Starting point default to home
   * @param {string[]} visited Array of already visited servers
   * @param depth The current depth in traversal
   */
  function* recurseServers(
    fn = () => {},
    current = "home",
    visited: string[] = [],
    depth = 0,
  ): any {
    if (!visited.includes(current)) {
      //ns.print(depth.toString().padStart(4) + " ||  ".repeat(depth + 1) + current)
      yield {
        hostname: current,
        depth: depth,
        path: [...visited.slice().reverse(), current],
      };
      let next = ns.scan(current);
      for (let n of next) {
        yield* recurseServers(fn, n, [current, ...visited], depth + 1);
      }
    }
  }
}

const secondsPerYear = 31536000;
const secondsPerDay = 86400;
const secondsPerHour = 3600;
const secondsPerMinute = 60;

export function millisecondsToString(milliseconds: number) {
  const secs = milliseconds / 1000; // convert to seconds
  var years = Math.floor(secs / secondsPerYear);
  var days = Math.floor((secs % secondsPerYear) / secondsPerDay);
  var hours = Math.floor(
    ((secs % secondsPerYear) % secondsPerDay) / secondsPerHour,
  );
  var minutes = Math.floor(
    (((secs % secondsPerYear) % secondsPerDay) % secondsPerHour) /
      secondsPerMinute,
  );
  var seconds =
    (((secs % secondsPerYear) % secondsPerDay) % secondsPerHour) %
    secondsPerMinute;

  let str = "";
  if (years > 0) {
    str += years + " years ";
  }
  if (days > 0) {
    str += days + " days ";
  }
  if (hours > 0) {
    str += hours + " hours ";
  }
  if (hours > 0) {
    str += hours + " hours ";
  }
  if (minutes > 0) {
    str += minutes + " minutes ";
  }
  return str + seconds + " seconds";
}
