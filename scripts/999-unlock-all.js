/** @param {NS} ns **/
export async function main(ns) {
	let targets = getAllTargets(ns);
	let server = ns.getServer();

	targets.forEach( target => {
		ns.tprint("Unlocking " + target.hostname + " with " + server.hostname);
		ns.exec("scripts/unlock-server.js", server.hostname, 1, target.hostname);
	});
}

function getAllTargets(ns) {
	// TODO: Having to cap infinite loop arbitrarily. Struggling
	// to get the scanQueue to remove a server once scanned.

	let targets = [];
	let scanQueue = [];
	let scanned = [];

	let levelOneTargets = ns.scan();
	levelOneTargets.forEach( t => {
		let server = ns.getServer(t);
		if (!server.purchasedByPlayer && t !== "home" && t !== "darkweb") {
			targets.push(t);
			scanQueue.push(t);
		}
	});
	
	let i = 0
	while (scanQueue.length > 0 && i < 30) {
		let results = [];

		scanQueue.forEach( t => {
			let result = ns.scan(t);
			result.forEach( server => {
				results.push(server)
			});
		});

		// Do something with results.
		let uniqueResults = [...new Set(results)];
		uniqueResults.forEach( async r => {
			if (r in scanned === false) {
				targets.push(r);	
				scanQueue.push(r);
			}
		});
		i++;
	};

	let uniqueTargets = [...new Set(targets)];

	let targetServers = [];
	uniqueTargets.forEach( t => {
		targetServers.push(ns.getServer(t));
	});

	return targetServers;
}