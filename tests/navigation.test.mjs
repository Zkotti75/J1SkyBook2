import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Minimal DOM boundary: tests real app event handlers, data loading and hash routes.
const elements = new Map();
function element(selector) {
  if (!elements.has(selector)) elements.set(selector, {
    value:'', innerHTML:'', textContent:'', hidden:false, listeners:{}, attributes:{},
    classList:{ values:new Set(), toggle(k,on){on ? this.values.add(k) : this.values.delete(k);} },
    setAttribute(k,v){this.attributes[k]=v;}, addEventListener(k,f){this.listeners[k]=f;}, focus(){},
  });
  return elements.get(selector);
}
const events = new Map();
globalThis.document = {querySelector:element,documentElement:{style:{setProperty(){}}},title:''};
globalThis.addEventListener = (type, fn) => events.set(type,fn);
let hash = '';
globalThis.location = { get hash(){return hash;}, set hash(value){if(value===hash)return;hash=value;queueMicrotask(()=>events.get('hashchange')?.());},replace(value){this.hash=value;} };
globalThis.fetch = async path => {
  const body = await readFile(new URL(`../${path}`, import.meta.url),'utf8');
  return {ok:true,json:async()=>JSON.parse(body)};
};
const settled = () => new Promise(r=>setTimeout(r,25));
const click = selector => element(selector).listeners.click({target:{closest:()=>null}});
await import('../app.js');
await settled();
test('fresh opening defaults to comparison with match menu and new title', () => {
  assert.equal(hash,'#/match/kashiwa/urawa/undated/comparison');
  assert.equal(element('#match-nav').hidden,false);
  assert.equal(element('.sidebar-tools').hidden,true);
  assert.ok(element('#detail').innerHTML.includes('館藏數據'));
  assert.ok(document.title.includes('TVB 體育組天書系列'));
});
test('team button restores roster and player deep links; centre restores match', async () => {
  click('#home-button'); await settled();
  assert.equal(hash,'#/club/kashiwa');
  assert.equal(element('#match-nav').hidden,true);
  assert.equal(element('.sidebar-tools').hidden,false);
  assert.ok(element('#roster-list').innerHTML.includes('roster-item'));
  location.hash='#/club/kashiwa/player/1'; await settled();
  assert.ok(element('#detail').innerHTML.includes('猿田遙己'));
  click('#match-button'); await settled();
  assert.equal(element('#match-nav').hidden,false);
});
test('page and date switching persist in route and team changes retain match mode', async () => {
  element('#match-nav').listeners.click({target:{closest:()=>({dataset:{matchPage:'quotes'}})}});
  await settled();
  element('#detail').listeners.change({target:{id:'match-date',value:'2026-10-06'}});
  await settled();
  assert.equal(hash,'#/match/kashiwa/urawa/2026-10-06/quotes');
  element('#away-team').value='fc-tokyo'; element('#away-team').listeners.change();
  await settled();
  assert.equal(hash,'#/match/kashiwa/fc-tokyo/2026-10-06/quotes');
  assert.ok(element('#detail').innerHTML.includes('本場訪問'));
  assert.equal(element('#match-nav').hidden,false);
});
test('identical team selection is corrected and browser back restores menu', async () => {
  element('#away-team').value='kashiwa'; element('#away-team').listeners.change();
  await settled();
  assert.notEqual(element('#home-team').value,element('#away-team').value);
  location.hash='#/club/urawa/player/1'; await settled();
  assert.equal(element('#match-nav').hidden,true);
  assert.ok(element('#detail').innerHTML.includes('西川周作'));
  location.hash='#/match/kashiwa/urawa/undated/comparison'; await settled();
  assert.equal(element('#match-nav').hidden,false);
  assert.equal(element('#roster-list').hidden,true);
});
