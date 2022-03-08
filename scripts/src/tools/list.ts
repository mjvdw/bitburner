/** @param {import(".").NS} ns **/

import {
    getTargets,
    printTable
    // @ts-ignore
} from "/scripts/utils.js";

/**
 * Helper function to get the direct path to a particular server. Useful for
 * navigating the tree without having to search manually.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {

    let targets = getTargets(ns)

    let data = targets.map((target: any) => {
        return {
            server: target.hostname
        }
    })

    printTable(ns, data)

}