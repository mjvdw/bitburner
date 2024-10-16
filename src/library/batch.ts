import { NS } from "@ns";

import {
    isTargetPrepared,
    releaseRam,
    getBatchRam,
    SCRIPTS
} from "/library/utils.js";


/**
 * Batch script is the launcher for each of the hack, grow
 * and two weaken scripts that constitutes an entire batch.
 * This script is also responsible for determining whether the
 * server is ready to be hacked, and if it isn't, preparing the
 * server to be hacked by maximising money and minimising security.
 * 
 * @param ns Netscript object provided by Bitburner
 */
export async function main(ns: NS): Promise<void> {
    let target = ns.getServer(ns.args[0].toString());
    let threads = JSON.parse(ns.args[1].toString());
    let times = JSON.parse(ns.args[2].toString());
    let server = ns.getServer()


    // Calculate sleep times for batch style hacking.
    let w1Sleep = times.offset;
    let w2Sleep = 3 * times.offset;
    let gSleep = times.weaken - times.grow + times.offset * 2 - w2Sleep;
    let hSleep = times.weaken - times.hack - (w2Sleep + gSleep);


    // ns.tprint(`Starting batch on ${target.hostname} with ${threads.hack} hack threads, ${threads.grow} grow threads, ${threads.hackWeaken} hackWeaken threads and ${threads.growWeaken} growWeaken threads.`)
    // ns.tprint(isTargetPrepared(ns, target))


    // If the target is prepared (ie, max money, min security) then 
    // start a full HWGW batch. If it isn't prepared, do a half batch
    // with just the grow and weaken components.
    await ns.sleep(w1Sleep);
    if (isTargetPrepared(ns, target) && threads.hackWeaken > 0) {
        ns.exec(SCRIPTS.weaken, server.hostname, threads.hackWeaken, target.hostname, Math.random());
    }

    await ns.sleep(w2Sleep);
    if (threads.growWeaken > 0) {
        ns.exec(SCRIPTS.weaken, server.hostname, threads.growWeaken, target.hostname, Math.random());
    }

    await ns.sleep(gSleep);
    if (threads.grow > 0) {
        ns.exec(SCRIPTS.grow, server.hostname, threads.grow, target.hostname, Math.random());
    }

    await ns.sleep(hSleep);
    if (isTargetPrepared(ns, target) && threads.hack > 0) {
        ns.exec(SCRIPTS.hack, server.hostname, threads.hack, target.hostname, Math.random());
    }

    // After everything has run, release any reserved RAM for this batch so a new
    // batch can run.
    let batchRam = getBatchRam(ns, server, threads)
    releaseRam(ns, server, batchRam)
}