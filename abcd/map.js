const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = "wvyUBKWgBpFlB7aLCs7B";

// (async () => {
//   const result = await maptilerClient.geocoding.forward("atarra, banda", {
//     limit: 1,
//   });
//   console.log(result.features[0].geometry);
// })();

const result = await maptilerClient.geocoding.forward("atarra, banda", {
  limit: 1,
});

console.log(result.features[0].geometry);
