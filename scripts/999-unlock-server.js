/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];

    try {
        ns.brutessh(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.ftpcrack(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.relaysmtp(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.httpworm(target);
    } catch (error) {
        ns.print(error)
    }

    try {
        ns.sqlinject(target);
    } catch (error) {
        ns.print(error)
    }

    ns.nuke(target);
}