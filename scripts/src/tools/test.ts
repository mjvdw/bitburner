/** @param {import(".").NS} ns */

import {
    updateReservedRam,
    getReservedRamState,
    getReservedRamForServer,
    reserveRam,
    releaseRam,
    resetReservedRamForServer,
    getAllAugmentations
    // @ts-ignore
} from "/scripts/library/utils.js";


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {

    let augs = getAllAugmentations(ns)
    augs.forEach((a: any) => ns.tprint(a.name + ": " + ns.getAugmentationCost(a.name)))

}