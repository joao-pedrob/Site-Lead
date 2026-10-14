import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { horizontalWheelDelta } from '../src/lib/horizontal-scroll.ts';
const wheel = {deltaX: 0, deltaY: 100, deltaMode: 0, width: 1200, controlKey: false, interactive: false, canScrollVertically: false};
test('mouse wheel advances sideways and reverse wheel returns', () => {
 assert.equal(horizontalWheelDelta(wheel), 100);
 assert.equal(horizontalWheelDelta({...wheel, deltaY: -100}), -100);
});
test('native horizontal trackpad gestures and browser zoom stay native', () => {
 assert.equal(horizontalWheelDelta({...wheel, deltaX: 150}), null);
 assert.equal(horizontalWheelDelta({...wheel, controlKey: true}), null);
});
test('long panels and form controls keep their vertical scrolling', () => {
 assert.equal(horizontalWheelDelta({...wheel, canScrollVertically: true}), null);
 assert.equal(horizontalWheelDelta({...wheel, interactive: true}), null);
});
test('line wheel units normalize and large gestures cannot skip several panels', () => {
 assert.equal(horizontalWheelDelta({...wheel, deltaY: 3, deltaMode: 1}), 48);
 assert.equal(horizontalWheelDelta({...wheel, deltaY: 2, deltaMode: 2}), 960);
});
