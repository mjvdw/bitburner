/** @param {import(".").NS} ns */

import {
    updateReservedRam,
    getReservedRamState,
    getReservedRamForServer,
    reserveRam,
    releaseRam,
    resetReservedRamForServer
    // @ts-ignore
} from "/scripts/library/utils.js";


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {

    let installedAugs = ns.getOwnedAugmentations(false)
    ns.tprint(installedAugs)
    let purchasedAugs = ns.getOwnedAugmentations(true).filter((x: string) => !installedAugs.includes(x))
    ns.tprint(purchasedAugs)

}