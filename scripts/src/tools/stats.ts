/** @param {import(".").NS} ns */

// @ts-ignore
import { getTargets } from "/scripts/utils.js";

export async function main(ns: any) {

    let targets = getTargets(ns, true)
    targets.forEach((target: any) => ns.tprint(target.hostname))

}