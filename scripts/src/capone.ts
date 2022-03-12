/** @param {import(".").NS} ns */

// @ts-ignore
import { } from "/scripts/utils.js";

/**
 * 
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: any) {

    while (true) {
        if (!ns.isBusy()) {
            await ns.commitCrime("mug someone")
        }
        await ns.sleep(5000)
    }
}
