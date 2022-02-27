/** @param {import(".").NS} ns */

// @ts-ignore
import { getBatchThreads, getServerAvailableRam, getBatchTimes } from "/scripts/utils.js";


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {
    let target = ns.getServer("iron-gym")
    let server = ns.getServer()
    let times = getBatchTimes(ns, target)

    let threads = getBatchThreads(ns, server, target, getServerAvailableRam(ns, server.hostname), times)
    ns.tprint("Hack: " + threads.hack)
    ns.tprint("Weaken (Hack): " + threads.hackWeaken)
    ns.tprint("Grow: " + threads.grow)
    ns.tprint("Weaken (Grow): " + threads.growWeaken)
    ns.tprint("—".repeat(30));

    let total = threads.hack + threads.grow + threads.hackWeaken + threads.growWeaken
    ns.tprint("Total Threads: " + total)

    // let multiplier = 0.9
    // // let hackMoney = ns.getServerMaxMoney(target.hostname) * multiplier
    // let hackMoney = ns.getServerMoneyAvailable(target.hostname) * multiplier
    // let hackThreads = Math.trunc(ns.hackAnalyzeThreads(target.hostname, hackMoney))

    // let growRatio = 1 / (1 - multiplier)
    // let growThreads = Math.ceil(ns.growthAnalyze(target.hostname, growRatio))

    // // These constants come from the docs based on the known effect
    // // of HGW functions on the security of a server.
    // let hackWeakenThreads = Math.ceil(hackThreads / 25)
    // let growWeakenThreads = Math.ceil(growThreads / 12.5)

    // let go = true

    // if (go) {

    //     ns.tprint("Start")
    //     ns.tprint("Security: " + ns.getServerSecurityLevel(target.hostname))
    //     ns.tprint("Money: " + ns.getServerMoneyAvailable(target.hostname))

    //     ns.tprint("—".repeat(30));

    //     ns.tprint("Hacking")
    //     // await ns.exec("/scripts/lib/hack.js", server.hostname, 25, target.hostname)
    //     ns.tprint("Threads: " + hackThreads)
    //     await ns.hack(target.hostname, { threads: hackThreads })
    //     ns.tprint("Security: " + ns.getServerSecurityLevel(target.hostname))
    //     ns.tprint("Money: " + ns.getServerMoneyAvailable(target.hostname))

    //     ns.tprint("—".repeat(30));

    //     ns.tprint("First Weakening")
    //     // await ns.exec("/scripts/lib/weaken.js", server.hostname, 1, target.hostname)
    //     ns.tprint("Threads: " + hackWeakenThreads)
    //     await ns.weaken(target.hostname, { threads: hackWeakenThreads })
    //     ns.tprint("Security: " + ns.getServerSecurityLevel(target.hostname))
    //     ns.tprint("Money: " + ns.getServerMoneyAvailable(target.hostname))

    //     ns.tprint("—".repeat(30));

    //     ns.tprint("Growing")
    //     // await ns.exec("/scripts/lib/weaken.js", server.hostname, 1, target.hostname)
    //     ns.tprint("Threads: " + growThreads)
    //     await ns.grow(target.hostname, { threads: growThreads })
    //     ns.tprint("Security: " + ns.getServerSecurityLevel(target.hostname))
    //     ns.tprint("Money: " + ns.getServerMoneyAvailable(target.hostname))

    //     ns.tprint("—".repeat(30));

    //     ns.tprint("Second Weakening")
    //     // await ns.exec("/scripts/lib/weaken.js", server.hostname, 1, target.hostname)
    //     ns.tprint("Threads: " + growWeakenThreads)
    //     await ns.weaken(target.hostname, { threads: growWeakenThreads })
    //     ns.tprint("Security: " + ns.getServerSecurityLevel(target.hostname))
    //     ns.tprint("Money: " + ns.getServerMoneyAvailable(target.hostname))
}