/** @param {import(".").NS} ns */

// @ts-ignore
import { getTargets, buyServer } from "/scripts/utils.js";

/**
 * This is the "master" script for hacking servers.
 * It controls:
 * - Deciding which server to hack.
 * - Purchasing new client servers to increase hacking power.
 * - Starting batch controllers for each server.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    while (true) {
        // Get a list of servers that can be hacked by user.
        let targets = getTargets(ns, true)

        // Buy new servers with either the same RAM as home server 
        // or the maximum possible RAM for purchased servers.
        let money = ns.getServerMoneyAvailable("home")
        let ram = ns.getServerMaxRam("home")
        if (money > ns.getPurchasedServerCost(ram)) {
            buyServer(ns = ns, ram = ram)
        }

        // If debug flag is set to true, this will interupt the while
        // statement after one full loop.
        let debug = ns.args[0]
        if (debug) { break }

        // Sleep for 60 seconds, then repeat the above.
        // Only necessary if not debugging.
        await ns.sleep(60000)
    }
}
