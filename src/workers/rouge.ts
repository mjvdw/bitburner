import { NS } from "@ns";

import {
    FACTIONS,
    FACTION_WORKTYPES,
    getReputationForDonations,
    getUnownedAugmentationsForFaction,
    unlockTarget,
    directConnect,
    updateFactionWorking,
    getMaxReputationForFaction
} from "/library/utils.js";

import { criteria } from "/library/faction-criteria.js"

/**
 * Worker to control joining factions and purchasing organisations.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: NS): Promise<void> {

    while (true) {

        // Work through the list of factions not already joined and take 
        // any action immediately available to meet the criteria to join them.
        await attemptToMeetCriteria(ns)

        // Check for faction invitations. If there is an invitation, 
        // check that there are augmentations worth obtaining. If yes, 
        // join the faction. If no, do nothing.
        let invites = ns.singularity.checkFactionInvitations()
        invites.forEach((faction: string) => {
            let augs = getUnownedAugmentationsForFaction(ns, faction)
            if (augs != Array("NeuroFlux Governor")) {
                ns.singularity.joinFaction(faction)
                ns.tprint("Joined faction: " + faction)
            }
        })

        // Identify the best faction to be working for.
        // This is based on the goal of getting enough faction favor to enable
        // donations, which will allow player to buy reputation as needed.
        let factions = ns.getPlayer().factions
        let maxRep: any = {}
        factions.forEach((faction: string) => {
            let donationOnly = ns.args[0]
            if (donationOnly) { maxRep[faction] = getReputationForDonations(ns, faction) }
            else { maxRep[faction] = getMaxReputationForFaction(ns, faction) }
        })
        let repNeeded = factions.filter((faction: string) => {
            return ns.singularity.getFactionRep(faction) < maxRep[faction] && ns.singularity.getFactionFavor(faction) < 150
        })

        if (repNeeded.length > 0) {
            ns.singularity.stopAction()

            // Start generating rep for the first in the list.
            let faction = Object.entries(criteria)
                .map((value: any) => value[1])
                .filter((faction: any) => faction.faction == repNeeded[0])[0].faction

            let i = 0
            let worktypes = FACTION_WORKTYPES
            let success = false
            while (!success && i < 3) {
                success = ns.singularity.workForFaction(faction, worktypes[i], false)
                i++
            }

            updateFactionWorking(ns, faction, true)

            // TODO: Change so that the faction with the most needed augmentations
            // goes first. Ie, if a faction has useful strength augmentations, that might
            // be favoured less than a faction with good hacking augmentations.
        } else {
            // If there are absolutely no factions that need more rep (ie, because we've 
            // unlocked donations for all of them) then buy and install whatever augmentations are
            // needed to actually activate donations. If donations are available for all factions,
            // do nothing.
        }

        // Wait 60 seconds to avoid infinite loop problems.
        await ns.sleep(60000)
    }

}


/**
 * Attempt to meet any criteria that can be done instantly. 
 * Eg, install a backdoor on a server, or hold a certain position in a company.
 * This function would not trigger actions to meet longer term criteria,
 * like gaining faction or company reputation. That comes later.
 * 
 * @param ns Netscript object provider by Bitburner
 */
async function attemptToMeetCriteria(ns: any) {

    let remainingFactionCriteria = Object.entries(criteria)
        .map((value: any) => value[1])
        .filter((criteria: any) => !ns.getPlayer().factions.includes(criteria.faction))

    for (let criteria of remainingFactionCriteria) {

        // For targets that require a backdoor to be installed on a specific server.
        if (criteria.backdoorRequired) {
            let unlocked = unlockTarget(ns, criteria.server)

            let hackLevel = ns.getPlayer().hacking
            let requiredHackLevel = ns.getServer(criteria.server).requiredHackingSkill

            if (unlocked && hackLevel >= requiredHackLevel) {
                directConnect(ns, criteria.server)
                await ns.singularity.installBackdoor()
                ns.tprint("Installed backdoor on " + criteria.server)
                ns.singularity.connect("home")
            }
        }


        // ADD MORE CRITERIA ATTEMPTS HERE
    }
}