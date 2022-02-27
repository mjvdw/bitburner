/** @param {import(".").NS} ns */
export async function main(ns: any) {
    let target = ns.args[0]
    await ns.grow(target)
    // ns.tprint(ns.nFormat(ns.getServerMoneyAvailable(target), "$0.000a") + " / " + ns.nFormat(ns.getServerMaxMoney(target), "$0.000a"))
}