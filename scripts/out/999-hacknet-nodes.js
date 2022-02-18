var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @param {import(".").NS} ns **/
export function main(ns) {
    return __awaiter(this, void 0, void 0, function* () {
        ns.disableLog("sleep");
        ns.disableLog("getServerMoneyAvailable");
        if (ns.hacknet.numNodes() == 0) {
            ns.hacknet.purchaseNode();
        }
        let cnt = ns.args[0];
        while (true) {
            let money = ns.getServerMoneyAvailable("home");
            // 1. Find node with minimum price action.
            // Return both node and action (or purchase new node).
            let upgrades = [];
            for (let i = 0; i < ns.hacknet.numNodes(); i++) {
                // Get the lowest cost action for each node.
                let { cost, action } = getMinCostOfNextAction(ns, i);
                upgrades.push({
                    cost: cost,
                    action: action,
                    node: i,
                });
            }
            if (ns.hacknet.numNodes() < cnt) {
                // Once off push for the purchase new node option.
                upgrades.push({
                    cost: ns.hacknet.getPurchaseNodeCost(),
                    action: ns.hacknet.purchaseNode,
                    node: null,
                });
            }
            // Sort options to get minimum cost option.
            upgrades.sort((a, b) => {
                return a.cost - b.cost;
            });
            let upgrade = upgrades[0];
            if (money > upgrade.cost) {
                if (upgrade.action.name == "purchaseNode") {
                    upgrade.action();
                }
                else {
                    upgrade.action(upgrade.node);
                }
            }
            yield ns.sleep(100);
        }
    });
}
function getMinCostOfNextAction(ns, node) {
    let levelCost = Number(ns.hacknet.getLevelUpgradeCost(node));
    let ramCost = Number(ns.hacknet.getRamUpgradeCost(node));
    let coreCost = Number(ns.hacknet.getCoreUpgradeCost(node));
    let costs = [levelCost, ramCost, coreCost];
    let minCost = Math.min(...costs);
    let action = null;
    let cost = Infinity;
    switch (minCost) {
        case levelCost:
            action = ns.hacknet.upgradeLevel;
            cost = levelCost;
            break;
        case ramCost:
            action = ns.hacknet.upgradeRam;
            cost = ramCost;
            break;
        case coreCost:
            action = ns.hacknet.upgradeCore;
            cost = coreCost;
            break;
        default:
            break;
    }
    return { cost, action };
}
//# sourceMappingURL=999-hacknet-nodes.js.map