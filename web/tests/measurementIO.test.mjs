import test from 'node:test';
import assert from 'node:assert/strict';
import {parseMeasurementImport} from '../js/measurementIO.mjs';
const valid = () => JSON.stringify({
 schema:'scoliovision.measurement.v1', method:'manual-four-point-endplate-angle',
 imageSize:{width:800,height:1200},
 endplates:{superior:[{x:1,y:2},{x:500,y:50}],inferior:[{x:50,y:900},{x:600,y:940}]}
});
const size = {width:800,height:1200};
test('imports the original four image-space endpoints',()=>assert.deepEqual(parseMeasurementImport(valid(),size)[0],{x:1,y:2}));
test('rejects invalid JSON',()=>assert.throws(()=>parseMeasurementImport('{',size),/JSON/));
test('rejects wrong image dimensions',()=>assert.throws(()=>parseMeasurementImport(valid(),{width:801,height:1200}),/尺寸/));
test('rejects out-of-bounds landmarks',()=>{
 const raw=JSON.parse(valid());raw.endplates.superior[0].x=-1;
 assert.throws(()=>parseMeasurementImport(JSON.stringify(raw),size),/坐标/);
});
test('rejects wrong measurement schema',()=>{
 const raw=JSON.parse(valid());raw.schema='untrusted';
 assert.throws(()=>parseMeasurementImport(JSON.stringify(raw),size),/只支持/);
});
test('rejects coincident endpoints',()=>{
 const raw=JSON.parse(valid());raw.endplates.superior[1]=raw.endplates.superior[0];
 assert.throws(()=>parseMeasurementImport(JSON.stringify(raw),size),/重合/);
});
