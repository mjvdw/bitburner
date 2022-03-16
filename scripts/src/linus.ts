/** @param {import(".").NS} ns */

// @ts-ignore
import { } from "/scripts/utils.js";

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
        let ramCost = ns.getUpgradeHomeRamCost()
        let coresCost = ns.getUpgradeHomeCoresCost()
        let money = ns.getServerMoneyAvailable("home")

        let upgrade = ramCost <= coresCost ? "RAM" : "CORES"

        if (upgrade == "RAM" && money >= ramCost) {
            ns.upgradeHomeRam()
            ns.tprint("Upgraded RAM on home server!")
        } else if (upgrade == "CORES" && money >= coresCost) {
            ns.upgradeHomeCores()
            ns.tprint("Upgraded cores on home server!")
        }

        await ns.sleep(60000)
    }

}
