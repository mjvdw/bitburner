/** @param {import(".").NS} ns */

import {
    upgradeHomeServer,
    maintainPurchasedServers,
    ownsTorRouter,
    buyFromDarkweb
    // @ts-ignore
} from "/scripts/library/utils.js";

/**
 * Automate the process of upgrading your home computer and
 * other functions like buying Tor router or .exe scripts for 
 * opening ports.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    let flags: any = ns.flags([
        ["pservs", true]
    ])

    while (true) {
        // Continually upgrade "home" server to the next available upgrade.
        upgradeHomeServer(ns)

        // Keep purchased servers in lockstep with "home", up to their max.
        if (flags["pservs"]) { await maintainPurchasedServers(ns) }

        // If player doesn't already own Tor router and has enough money, buy
        // the Tor router.
        let enoughMoney = ns.getServerMoneyAvailable("home") >= 2e5
        if (!ownsTorRouter(ns) && enoughMoney) { ns.purchaseTor() }

        // Once user owns Tor router, purchase port scripts once enough money.
        // If player doesn't have enough money at this point, just move on, don't wait.
        if (ownsTorRouter(ns)) { buyFromDarkweb(ns) }

        await ns.sleep(10000)
    }
}

