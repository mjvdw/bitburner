/** @param {import(".").NS} ns */

// @ts-ignore
// import { } from "/scripts/utils.js";

/**
 * 
 * @param ns Netscript object provided by Bitburner.
 */
export async function main(ns: any) {

    while (true) {
        await ns.share()
    }


}