/** @param {import(".").NS} ns */

// @ts-ignore
import { upgradeHomeServer } from "/scripts/utils.js";

/**
 * Automate the process of upgrading your home computer and
 * other functions like buying Tor router or .exe scripts for 
 * opening ports.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    ns.disableLog("getUpgradeHomeRamCost")
    ns.disableLog("getUpgradeHomeCoresCost")
    ns.disableLog("getServerMoneyAvailable")
    ns.disableLog("sleep")

    while (true) {
        upgradeHomeServer(ns)
        await ns.sleep(60000)
    }
}
