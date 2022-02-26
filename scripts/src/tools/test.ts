/** @param {import(".").NS} ns */

// @ts-ignore
import { getOptimalBatchThreads } from "/scripts/utils.js";


/**
 * Generic file for testing purposes only.
 * 
 * @param ns Netscript object provider by Bitburner.
 */
export async function main(ns: any) {
    let batches = getOptimalBatchThreads(ns, 8012, 8.6)
    ns.tprint(batches)
}