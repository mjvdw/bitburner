import { NS } from "@ns";
import { getTargets, isTargetPrepared, getServerAvailableRam, unlockTarget, SCRIPTS } from "/library/utils.js";

/**
 * This is a junior version of the "master" script for hacking servers.
 * It just cycles through HGW. Not super efficient, but lowest ram use.
 * 
 * @param ns Netscript object provider by Bitburner
 */
export async function main(ns: NS): Promise<void> {

    let singleTarget = ns.args[0].toString();
    let targets = singleTarget ? [ns.getServer(singleTarget)] : getTargets(ns, true)

    let ram = getServerAvailableRam(ns, "home") - ns.getScriptRam(SCRIPTS.icarusjr)
    let baseThreads = Math.trunc(ram / 1.7)
    baseThreads = baseThreads <= 0 ? 1 : baseThreads

    let target = targets[0]
    unlockTarget(ns, target)

    while (!isTargetPrepared(ns, target)) {
        await ns.grow(target.hostname, { threads: baseThreads })
        await ns.weaken(target.hostname, { threads: baseThreads })
    }

    while (true) {
        await ns.hack(target.hostname, { threads: baseThreads })
        await ns.weaken(target.hostname, { threads: baseThreads })
        await ns.grow(target.hostname, { threads: baseThreads })
        await ns.weaken(target.hostname, { threads: baseThreads })
    }
}
