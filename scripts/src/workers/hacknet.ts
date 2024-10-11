/** @param {import(".").NS} ns */

/**
 * Automate the process of leveling up Hacknet Nodes.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {
    while (true) {
        let numNodes = ns.hacknet.numNodes();
        for (let i = 0; i < numNodes; i++) {
            let cost = ns.hacknet.getLevelUpgradeCost(i);
            let money = ns.getServerMoneyAvailable("home");
            if (money > cost) {
                ns.hacknet.upgradeLevel(i, 1);
            }
        }
        await ns.sleep(1000);
    }
}