/** @param {import(".").NS} ns */

import {
    getTargets,
    printTable,
    isTargetPrepared,
    getReservedRamForServer,
    getReservedRamState,
    // getServersHackingTarget,
    // getServersPreparingTarget
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
            break
        case "servers":
            data = getServerStats(ns)
            break
        default:
            ns.tprint("That's not a valid input. Please try again. Valid inputs: 'hacking', 'servers'")
            break
    }

    if (data.length > 0) {
        printTable(ns, data)
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

        // Server available money v max money
        let money = ns.nFormat(target.moneyAvailable, "0.00a")
            + "/"
            + ns.nFormat(target.moneyMax, "0.00a")
            + " ("
            + (target.moneyAvailable / target.moneyMax * 100).toFixed(2)
            + "%)"

        // Current state of "attack"
        let preparing = getServersPreparingTarget(ns, target)
        let hacking = getServersHackingTarget(ns, target)


        return {
            server: target.hostname,
            money: money,
            security: (target.hackDifficulty).toFixed(2),
            prep: "*".repeat(preparing.length),
            ready: isTargetPrepared(ns, target) ? "*" : "",
            hack: "*".repeat(hacking.length)
        }
    })

    return data
}


function getServersHackingTarget(ns: any, target: any): any[] {

    let serversHackingTarget: any[] = []
    let pservs = ns.getPurchasedServers()

    pservs.forEach((pserv: any) => {
        // Use ports instead of iterating through
    })

    return serversHackingTarget
}


function getServersPreparingTarget(ns: any, target: any): any[] {
    return []
}


function getServerStats(ns: any): object[] {

    let home = ["home"]
    let pservs = ns.getPurchasedServers()
    let servers = home.concat(pservs)

    servers = servers.map((s: string) => ns.getServer(s))

    let data = servers.map((s: any) => {

        let utilisation = getReservedRamForServer(ns, s)

        // let state = getReservedRamState(ns, s)
        // ns.tprint(state)

        return {
            server: s.hostname,
            ram: utilisation
        }
    })

    return data

}