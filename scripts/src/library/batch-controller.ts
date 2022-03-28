/** @param {import(".").NS} ns */

import {
    unlockTarget,
    reserveRam,
    getReservedRamForServer,
    getBatchThreads,
    getBatchTimes,
    getBatchRam,
    getServerAvailableRam,
    resetReservedRamForServer,
    SCRIPTS,
    MAX_BATCHES
    // @ts-ignore
} from "/scripts/library/utils.js";

/**
 * The controller for starting each hack batch. While hacking, there
 * should be one batch-controller.js script running on each server.
 * This script will never be called directly, it should always be 
 * triggered by the master controller (icarus.js) script.
 * 
 * Implementing HWGW batching method from Bitburner docs.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    let server = ns.getServer()
    let target = ns.getServer(ns.args[0])
    let batchScript = SCRIPTS.batch

    // Unlock server. This means opening all ports available and then
    // attempting to NUKE the server. Only servers that can be unlocked
    // should make it through the master controller to this point, so 
    // this step should always succeed.
    unlockTarget(ns, target)

    // Calculate threads, time and RAM required to run batch script.
    let startRam = getServerAvailableRam(ns, server.hostname) * 4
    let times = getBatchTimes(ns, target)
    let threads = getBatchThreads(ns, server, target, startRam, times)
    let batchRam = getBatchRam(ns, server, threads)

    // Before running individual batches, clear the reserved RAM from
    // any previous runs for this server.
    resetReservedRamForServer(ns, server)

    // Create hack/grow/weaken batches continuously, with a delay so that
    // batches are deployed at a consistent rate. Reserve RAM needed to fully
    // run each batch - this is necessary because of the delay starting each 
    // component of the batch - the server may run out of RAM to complete each
    // batch because the next batch started too quickly.
    while (true) {
        let availableRam = startRam - getReservedRamForServer(ns, server.hostname)
        let numScripts = ns.ps().length
        if (availableRam >= batchRam && numScripts <= (MAX_BATCHES * 5) + 10) {
            ns.exec(batchScript, server.hostname, 1, target.hostname, JSON.stringify(threads), JSON.stringify(times), Math.random())
            reserveRam(ns, server, batchRam)
        }
        await ns.sleep(times.interval)
    }
}