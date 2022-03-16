/** @param {import(".").NS} ns */

import {
    getTargets,
    printTable,
    isTargetPrepared,
    getReservedRamForServer,
    CRIMES
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
            ns.tprint("That's not a valid input. Please try again. Valid inputs: 'hacking', 'servers', 'money', or 'crimes'")
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
        let rate = (ns.hackAnalyze(target.hostname) * ns.getServerMaxMoney(target.hostname)) / (ns.getWeakenTime(target.hostname) / 1000)

        return {
            server: target.hostname,
            money: money,
            security: (target.hackDifficulty).toFixed(2),
            time: ns.nFormat(ns.getWeakenTime(target.hostname) / 1000, "00:00:00"),
            "rate/thread": ns.nFormat(rate, "$0.00") + "/s",
            prep: "*".repeat(preparing.length),
            ready: isTargetPrepared(ns, target) ? "*" : "",
            hack: "*".repeat(hacking.length)
        }
    })

    return data
}


/**
 * Helper function to determine whether a given target is being
 * hacked (as opposed to prepared, or no action at all).
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param target The target potentially being hacked.
 * @returns Boolean indicating whether the given target is being hacked.
 */
function getServersHackingTarget(ns: any, target: any): any[] {

    let serversHackingTarget: any[] = []
    let pservs = ns.getPurchasedServers()

    pservs.forEach((pserv: any) => {
        // Use ports instead of iterating through
    })

    return serversHackingTarget
}


/**
 * Helper function to determine whether a given target is being
 * prepared (as opposed to hacked, or no action at all).
 * 
 * @param ns Netscript object provided by Bitburner.
 * @param target The target potentially being prepared.
 * @returns Boolean indicating whether the given target is being prepared.
 */
function getServersPreparingTarget(ns: any, target: any): any[] {
    return []
}


/**
 * Helper function to generate useful data about the player's
 * purchased servers.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns 
 */
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
            maxram: s.maxRam,
            reserved: reservedRam,
            used: usedRam
        }
    })

    return data
}


/**
 * Helper function to generate stats about the users money.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns 
 */
function getMoneyStats(ns: any): any[] {
    return [{
        money: ns.nFormat(ns.getServerMoneyAvailable("home"), "$0,0.00")
    }]
}


/**
 * Helper function to generate useful information about crimes.
 * 
 * @param ns Netscript object provided by Bitburner.
 * @returns 
 */
function getAllCrimeStats(ns: any): any[] {

    let crimes = CRIMES
    let bitnodeMultiplier = 0.256

    let data: any[] = []
    crimes.forEach((crime: string) => {
        let stats = ns.getCrimeStats(crime)
        let money = stats.money * bitnodeMultiplier
        let d = {
            name: stats.name,
            i: crimes.indexOf(crime) + 1,
            money: ns.nFormat(money, "$0.000a"),
            chance: ns.nFormat(ns.getCrimeChance(stats.name), "0.00%"),
            diff: ns.nFormat(stats.difficulty, "0.00"),
            "rate/sec": ns.nFormat((money / (stats.time / 1000)) * ns.getCrimeChance(stats.name), "$0.000a")
        }
        data.push(d)
    })

    return data
}