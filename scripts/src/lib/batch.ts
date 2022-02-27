/** @param {import(".").NS} ns */

import {
    isTargetPrepared
    // @ts-ignore
} from "/scripts/utils.js";


/**
 * Batch script is the launcher for each of the hack, grow
 * and two weaken scripts that constitutes an entire batch.
 * This script is also responsible for determining whether the
 * server is ready to be hacked, and if it isn't, preparing the
 * server to be hacked by maximising money and minimising security.
 * 
 * @param ns Netscript object provided by Bitburner
 */
export async function main(ns: any) {
    let target = ns.getServer(ns.args[0])
    let threads = JSON.parse(ns.args[1])
    let times = JSON.parse(ns.args[2])

    let targetPrepared = isTargetPrepared(ns, target)
}