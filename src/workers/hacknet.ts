import { NS } from "@ns";

/**
 * Automate the process of leveling up Hacknet Nodes.
 *
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: NS): Promise<void> {
  while (true) {
    let numNodes = ns.hacknet.numNodes();
    let maxNodes = ns.hacknet.maxNumNodes();
    let money = ns.getServerMoneyAvailable("home");

    // Get the lowest cost upgrade
    let upgradeCosts: { id: number; cost: number; func: Function }[] = [];

    upgradeCosts.push({
      id: 0,
      cost: ns.hacknet.getPurchaseNodeCost(),
      func: ns.hacknet.purchaseNode,
    });

    // Upgrade the lowest cost upgrade if we have enough money
    for (let i = 0; i < numNodes; i++) {
      upgradeCosts.push(
        ...[
          {
            id: i,
            cost: ns.hacknet.getRamUpgradeCost(i),
            func: ns.hacknet.upgradeRam,
          },
          {
            id: i,
            cost: ns.hacknet.getCoreUpgradeCost(i),
            func: ns.hacknet.upgradeCore,
          },
          {
            id: i,
            cost: ns.hacknet.getLevelUpgradeCost(i),
            func: ns.hacknet.upgradeLevel,
          },
        ],
      );
    }

    let lowestCostUpgrade = upgradeCosts.reduce((a, b) =>
      a.cost < b.cost ? a : b,
    );

    if (money > lowestCostUpgrade.cost) {
      if (
        lowestCostUpgrade.func === ns.hacknet.purchaseNode &&
        numNodes < maxNodes
      ) {
        lowestCostUpgrade.func();
      } else {
        lowestCostUpgrade.func(lowestCostUpgrade.id);
      }
    }

    await ns.sleep(1000);
  }
}
