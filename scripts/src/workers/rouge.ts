/** @param {import(".").NS} ns */

import {
    FACTIONS,
    getReputationForDonations,
    getUnownedAugmentationsForFaction
    // @ts-ignore
} from "/scripts/library/utils.js";

import {
    criteria
    // @ts-ignore
} from "/scripts/library/faction-criteria.js"

/**
 * Worker to control joining factions and purchasing organisations.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {


    // Check for faction invitations. If there is an invitation, 
    // check that there are augmentations worth obtaining. If yes, 
    // join the faction. If no, do nothing.
    let invites = ns.checkFactionInvitations()
    invites.forEach((faction: string) => {
        let augs = getUnownedAugmentationsForFaction(ns, faction)
        if (augs != ["NeuroFlux Governor"]) {
            ns.joinFaction(faction)
            ns.tprint("Joined faction: " + faction)
        }
    })

    let rep = getReputationForDonations()

}
