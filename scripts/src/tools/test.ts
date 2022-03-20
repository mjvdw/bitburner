/** @param {import(".").NS} ns */

import {
    updateReservedRam,
    getReservedRamState,
    getReservedRamForServer,
    reserveRam,
    releaseRam,
    resetReservedRamForServer,
    getAllAugmentations,
    buyFromDarkweb,
    getUnownedAugmentationsForFaction,
    getOwnedAugmentationsForFaction,
    FACTIONS
    // @ts-ignore
} from "/scripts/library/utils.js";


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {

    let i = 6

    ns.tprint("\nOWNED")
    let owned = getOwnedAugmentationsForFaction(ns, FACTIONS[i])
    owned.forEach((a: string) => ns.tprint(a))

    ns.tprint("\nUNOWNED")
    let unowned = getUnownedAugmentationsForFaction(ns, FACTIONS[i])
    unowned.forEach((a: string) => ns.tprint(a))

}