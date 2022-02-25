/** @param {import(".").NS} ns */
export async function main(ns: any) {
    let target = ns.args[0]
    ns.weaken(target)
}