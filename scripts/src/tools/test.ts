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
    FACTIONS,
    directConnect,
    getReputationForDonations
    // @ts-ignore
} from "/scripts/library/utils.js";

import {
    criteria,
    // @ts-ignore
} from "/scripts/library/faction-criteria.js"


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {
    ns.tprint(getReputationForDonations())

}