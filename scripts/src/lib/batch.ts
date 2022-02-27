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
    let server = ns.getServer()


    // Calculate sleep times for batch style hacking.
    let w1Sleep = times.offset;
    let w2Sleep = 3 * times.offset;
    let gSleep = times.weaken - times.grow + times.offset * 2 - w2Sleep;
    let hSleep = times.weaken - times.hack - (w2Sleep + gSleep);


    // If the target is prepared (ie, max money, min security) then 
    // start a full HWGW batch. If it isn't prepared, do a half batch
    // with just the grow and weaken components.
    if (isTargetPrepared(ns, target)) {
        await ns.sleep(w1Sleep);
        ns.exec("/scripts/lib/weaken.js", server.hostname, threads.hackWeaken, target.hostname, Math.random());
    }

    await ns.sleep(w2Sleep);
    ns.exec("scripts/lib/weaken.js", server.hostname, threads.growWeaken, target.hostname, Math.random());

    await ns.sleep(gSleep);
    ns.exec("scripts/lib/grow.js", server.hostname, threads.grow, target.hostname, Math.random());

    if (isTargetPrepared(ns, target)) {
        await ns.sleep(hSleep);
        ns.exec("scripts/lib/hack.js", server.hostname, threads.hack, target.hostname, Math.random());
    }
}