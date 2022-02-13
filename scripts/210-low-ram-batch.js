/** @param {import(".").NS} ns **/
export async function main(ns) {
  let target = ns.args[0];
  let maxThreads = ns.args[1];
  let preparingServer = ns.args[2] | false;

  let times = getTimes(ns, target);
  let threads = getThreads(ns, target, maxThreads);

  let validThreads = Object.keys(threads).every((n) => threads[n] >= 1);
  // ns.tprint(validThreads);
  if (validThreads) {
    await runBatch(ns, target, times, threads, preparingServer);
  }
}

function getTimes(ns, target) {
  // Get run times for server.
  let wTime = ns.getWeakenTime(target);
  let gTime = ns.getGrowTime(target);
  let hTime = ns.getHackTime(target);
  let times = {
    w: wTime,
    g: gTime,
    h: hTime,
    offset: 200,
  };

  return times;
}

function getThreads(ns, target, maxThreads) {
  let multiplier = 2;

  // Get ideal number of threads for preferred hack amount.
  let maxHackAmount = ns.getServerMaxMoney(target) / multiplier;
  let hackThreads = ns.hackAnalyzeThreads(target, maxHackAmount);
  let hackSecurityEffect = ns.hackAnalyzeSecurity(hackThreads);

  // First weaken reduces security after hack. Calculate threads needed.
  let firstWeakenEffect = 0;
  let firstWeakenThreads = hackThreads;
  while (firstWeakenEffect < hackSecurityEffect) {
    firstWeakenEffect = ns.weakenAnalyze(firstWeakenThreads);
    firstWeakenThreads++;
  }

  // Get grow threads needed to bring back up to full.
  let growThreads = ns.growthAnalyze(target, multiplier);
  let growSecurityEffect = ns.growthAnalyzeSecurity(growThreads);

  // Second weaken reduces security after growth. Calculate threads needed.
  let secondWeakenEffect = 0;
  let secondWeakenThreads = growThreads;
  while (secondWeakenEffect < growSecurityEffect) {
    secondWeakenEffect = ns.weakenAnalyze(secondWeakenThreads);
    secondWeakenThreads++;
  }

  // Scale down if this would use more threads than the maximum allowed.
  let totalThreads =
    hackThreads + growThreads + firstWeakenThreads + secondWeakenThreads;
  if (totalThreads > maxThreads) {
    let ratio = (maxThreads / totalThreads) * 0.8;

    hackThreads = hackThreads * ratio;
    growThreads = growThreads * ratio;
    firstWeakenThreads = firstWeakenThreads * ratio;
    secondWeakenThreads = secondWeakenThreads * ratio;
  }

  if (hackThreads < 1) {
    hackThreads = 1;
  }
  if (growThreads < 1) {
    growThreads = 1;
  }
  if (firstWeakenThreads < 1) {
    firstWeakenThreads = 1;
  }
  if (secondWeakenThreads < 1) {
    secondWeakenThreads = 1;
  }

  let threads = {
    w1: firstWeakenThreads,
    w2: secondWeakenThreads,
    g: growThreads,
    h: hackThreads,
  };

  return threads;
}

async function runBatch(ns, target, times, threads, preparingServer) {
  // If two the two weaken scripts have the same number of threads if won't
  // run both of them. Having a random ID allows them to run simultaneously.

  let server = "home";
  // Finish order:
  // 1. Hack
  // 2. Weaken
  // 3. Grow
  // 4. Weaken

  let w1Sleep = times.offset;
  let w2Sleep = 3 * times.offset;
  let gSleep = times.w - times.g + times.offset * 2 - w2Sleep;
  let hSleep = times.w - times.h - (w2Sleep + gSleep);

  await ns.sleep(w1Sleep);
  ns.exec("/scripts/113-weaken.js", server, threads.w1, target, Math.random());

  await ns.sleep(w2Sleep);
  ns.exec("/scripts/113-weaken.js", server, threads.w2, target, Math.random());

  await ns.sleep(gSleep);
  ns.exec("/scripts/112-grow.js", server, threads.g, target, Math.random());

  if (!preparingServer) {
    await ns.sleep(hSleep);
    ns.exec("/scripts/111-hack.js", server, threads.h, target, Math.random());
  }
}
