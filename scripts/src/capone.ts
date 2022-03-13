/** @param {import(".").NS} ns */

// @ts-ignore
import { } from "/scripts/utils.js";

/**
 * Simple loop designed to commit crimes on repeat. Initially
 * this is the fastest way to make money, but is only available
 * with the Singlularity BitNode (BN-4).
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    let crime = ns.args[0]

    let crimes = crime ? [crime] : 0

    while (true) {
        let crimeTime = 0
        if (!ns.isBusy()) {
            crimeTime = ns.commitCrime(crime)
        }
        await ns.sleep(crimeTime + 200)
    }
}
