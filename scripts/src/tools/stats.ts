/** @param {import(".").NS} ns */

import { STATUS_CODES } from "http";
import {
    getTargets,
    printTable,
    isTargetPrepared,
    getReservedRamForServer,
    getReservedRamState,
    getBatchTimes
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
        case "money":
            data = getMoneyStats(ns)
            break
        case "crimes":
            data = getAllCrimeStats(ns)
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
            + ns.nFormat(target.moneyAvailable / target.moneyMax, "0.00%")
            + ")"

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

        let reservedRam = ns.nFormat(getReservedRamForServer(ns, s) / s.maxRam, "0.00%")
        let usedRam = ns.nFormat(s.ramUsed / s.maxRam, "0.00%")

        return {
            server: s.hostname,
            reserved: reservedRam,
            used: usedRam,
            "batch time": 0
        }
    })

    return data

}


function getMoneyStats(ns: any): any[] {
    return [{
        money: ns.nFormat(ns.getServerMoneyAvailable("home"), "$0,0.00")
    }]
}


function getAllCrimeStats(ns: any): any[] {
    let crimes = ["shoplift", "rob store", "mug", "larceny", "drugs", "bond forge",
        "traffic illegal arms", "homicide", "grand auto", "kidnap", "assassin", "heist"]

    let data: any[] = []
    crimes.forEach((crime: string) => {
        let stats = ns.getCrimeStats(crime)
        let d = {
            name: crime,
            money: stats.money
        }
        data.push(d)
    })

    return data

}