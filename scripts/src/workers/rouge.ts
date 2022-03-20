/** @param {import(".").NS} ns */

import {
    FACTIONS,
    getReputationForDonations,
    getUnownedAugmentationsForFaction,
    unlockTarget,
    directConnect
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

    // while (true) {

    // Work through the list of factions not already joined and take 
    // any action immediately available to meet the criteria to join them.
    await attemptToMeetCriteria(ns)

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

    // Identify the best faction to be working for.
    // This is based on the goal of getting enough faction favor to enable
    // donations, which will allow player to buy reputation as needed.
    let rep = getReputationForDonations()
    let factions = ns.getPlayer().factions

    //     // Wait 60 seconds to avoid infinite loop problems.
    //     await ns.sleep(60000)
    // }

}


async function attemptToMeetCriteria(ns: any) {

    let remainingFactionCriteria = Object.entries(criteria)
        .map((value: any) => value[1])
        .filter((criteria: any) => !ns.getPlayer().factions.includes(criteria.faction))

    for (let criteria of remainingFactionCriteria) {
        if (criteria.backdoorRequired && ns.getHackingLevel() >= criteria.minHackingLevel) {
            unlockTarget(ns, criteria.server)
            directConnect(ns, criteria.server)
            await ns.installBackdoor()
            directConnect(ns, "home")
            ns.tprint("Installed backdoor on " + criteria.server)
        }
        await ns.sleep(200)
    }
}