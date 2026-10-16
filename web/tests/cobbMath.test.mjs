import test from 'node:test';
import assert from 'node:assert/strict';
import {cobbAngleFromPoints} from '../js/cobbMath.mjs';
const p=(x,y)=>({x,y});
test('parallel lines have 0-degree Cobb angle',()=>assert.ok(Math.abs(cobbAngleFromPoints([p(0,0),p(10,0),p(0,10),p(10,10)]))<1e-8));
test('perpendicular endplates measure 90 degrees',()=>assert.ok(Math.abs(cobbAngleFromPoints([p(0,0),p(10,0),p(5,0),p(5,10)])-90)<1e-8));
test('15 degree difference is geometric, not a hash-derived demo',()=>{
  const angle=cobbAngleFromPoints([p(0,0),p(10,0),p(0,10),p(10*Math.cos(Math.PI/12),10+10*Math.sin(Math.PI/12))]);
  assert.ok(Math.abs(angle-15)<1e-6);
});
test('reversing endpoint direction does not change angle',()=>assert.ok(Math.abs(cobbAngleFromPoints([p(10,0),p(0,0),p(0,10),p(10,20)])-45)<1e-8));
test('coincident endpoints are rejected',()=>assert.throws(()=>cobbAngleFromPoints([p(1,1),p(1,1),p(0,2),p(2,3)]),RangeError));
test('non-finite coordinates are rejected',()=>assert.throws(()=>cobbAngleFromPoints([p(0,0),p(NaN,5),p(0,0),p(4,5)]),TypeError));
