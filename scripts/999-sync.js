/** @param {import(".").NS} ns **/
export async function main(ns) {
  while (true) {
    await ns.wget("http://127.0.0.1:5000", "scripts.txt", "home");

    let scriptsList = await ns.read("scripts.txt");
    let scripts = scriptsList.split(",");
    for (let s in scripts) {
      let saveLocation = "/scripts/" + scripts[s];
      let url = "http://127.0.0.1:5000/" + scripts[s];

      await ns.wget(url, saveLocation, "home");
    }
    await ns.sleep(5000);
  }
}
