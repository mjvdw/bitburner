/** @param {import(".").NS} ns */

// @ts-ignore
import { unlockTarget } from "/scripts/utils.js";

export async function main(ns: any) {
    let target = ns.args[0]
    unlockTarget(ns, target)
}