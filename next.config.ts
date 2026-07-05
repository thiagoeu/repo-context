const { networkInterfaces } = require("os");

function getAllIPs() {
  const nets = networkInterfaces();
  const origins = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" || net.family === "IPv6") {
        origins.push(net.address);
        origins.push(`http://${net.address}:3000`);
      }
    }
  }

  return [...new Set(origins)];
}

module.exports = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "0.0.0.0", ...getAllIPs()],
};
