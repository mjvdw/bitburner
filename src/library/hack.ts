import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    let target = ns.args[0]
    await ns.hack(target)
}