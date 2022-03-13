/** @param {import(".").NS} ns */

// @ts-ignore
import { CRIMES } from "/scripts/utils.js";

/**
 * Simple loop designed to commit crimes on repeat. Initially
 * this is the fastest way to make money, but is only available
 * with the Singlularity BitNode (BN-4).
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    while (true) {
        let crime = getMostProfitableCrime(ns)
        let crimeTime = 0
        if (!ns.isBusy()) {
            crimeTime = ns.commitCrime(crime)
        }
        await ns.sleep(crimeTime + 200)
    }
}


/**
 * Determine which crime will be most profitable based on
 * the amount of money if successful and the chance of being
 * successful.
 * 
 * @param ns Netscript object provider by Bitburner
 * @returns A string with the name of the selected crime.
 */
function getMostProfitableCrime(ns: any): string {

    let crimes = ns.args[0] ? [ns.args[0]] : CRIMES

    let crimeDetails = crimes
        .map((c: string) => {
            let crime = ns.getCrimeStats(c)
            return {
                name: crime.name,
                rate: (crime.money / (crime.time / 1000)) * ns.getCrimeChance(crime.name)
            }
        })
        .sort((a: any, b: any) => b.rate - a.rate)

    let crime = crimeDetails[0].name
    return crime
}
