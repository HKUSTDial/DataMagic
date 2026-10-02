import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const world = read('../templates/choropleth-rank-map/world-110m.json');
const choropleth = read('../templates/choropleth-rank-map/sample-data.json');
const routes = read('../templates/map-route-accumulation/sample-data.json');

test('choropleth region codes exist in the Natural Earth base map', () => {
  const codes = new Set(world.features.map(feature => feature.properties.ADM0_A3));
  for (const region of choropleth.regions) assert.ok(codes.has(region.code), `Unknown region ${region.code}`);
});

test('map routes use valid longitude-latitude coordinates', () => {
  const coordinates = [routes.origin.coordinate, ...routes.routes.map(route => route.destination)];
  for (const [longitude, latitude] of coordinates) {
    assert.ok(longitude >= -180 && longitude <= 180);
    assert.ok(latitude >= -90 && latitude <= 90);
  }
  assert.equal(routes.routes.reduce((sum, route) => sum + route.value, 0), 122);
});
