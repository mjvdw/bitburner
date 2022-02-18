/** @param {import(".").NS} ns **/
export async function main(ns) {
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

  targetServers.forEach((s) => {
    ns.tprint(s.hostname);
  });
}
