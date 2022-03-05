/** @param {import(".").NS} ns */

import {
    getTargets,
    printTable
    // @ts-ignore
} from "/scripts/utils.js";

/**
 * Helper function to display useful statistics to the player.
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: any) {

    let data: object[] = []

    switch (ns.args[0]) {
        case "hacking":
            data = getHackingStats(ns)
            printTable(ns, data)
            break
        case "factions":
            ns.tprint("Factions TBC")
            break
        default:
            ns.tprint("That's not a valid input. Please try again. Valid inputs: 'hacking', 'factions'")
            break
    }
}


/**
 * Helper function to collate useful information about hacking servers.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns Data pre-formatted to print as a table.
 */
function getHackingStats(ns: any): object[] {
    let targets = getTargets(ns, true)

    let data = targets.map((target: any) => {
        return {
            server: target.hostname,
            money: ns.nFormat(target.moneyAvailable, "$0.00a"),
            security: (target.hackDifficulty).toFixed(2)
        }
    })
    return data
}