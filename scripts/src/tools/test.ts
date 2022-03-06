/** @param {import(".").NS} ns */

import {
    updateReservedRam,
    getReservedRamState,
    getReservedRamForServer,
    reserveRam,
    releaseRam,
    resetReservedRamForServer
    // @ts-ignore
} from "/scripts/utils.js";


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {

    let server = ns.getServer("home")

    reserveRam(ns, server, 10)
    ns.tprint(getReservedRamState(ns))

}