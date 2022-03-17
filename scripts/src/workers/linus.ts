/** @param {import(".").NS} ns */

import {
    upgradeHomeServer,
    maintainPurchasedServers
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

    while (true) {
        upgradeHomeServer(ns)
        await maintainPurchasedServers(ns)
        await ns.sleep(10000)
    }
}

