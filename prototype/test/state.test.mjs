import assert from "node:assert/strict";
import test from "node:test";
import { createInitialState, PhoneView, Projection, reduce, Tab, tracks } from "../src/state.js";

const send = (state, type, values = {}) => reduce(state, { type, ...values });

test("alternates independent radio states", () => {
  const withoutWifi = send(createInitialState(), "TOGGLE_WIFI");
  const result = send(withoutWifi, "TOGGLE_BLUETOOTH");
  assert.equal(result.wifiEnabled, false);
  assert.equal(result.bluetoothEnabled, false);
});

test("selects only valid tabs", () => {
  const initial = createInitialState();
  assert.equal(send(initial, "SELECT_TAB", { tab: Tab.MEDIA }).activeTab, Tab.MEDIA);
  assert.equal(send(initial, "SELECT_TAB", { tab: "hidden-admin" }), initial);
});

test("keeps only one active projection and connects the phone", () => {
  const android = send(createInitialState(), "CONNECT_PROJECTION", { projection: Projection.ANDROID_AUTO });
  const carplay = send(android, "CONNECT_PROJECTION", { projection: Projection.CARPLAY });
  assert.equal(carplay.projection, Projection.CARPLAY);
  assert.equal(carplay.projectionConnected, true);
  assert.equal(carplay.phone.connected, true);
});

test("rejects projection while Bluetooth is disabled", () => {
  const disabled = send(createInitialState(), "TOGGLE_BLUETOOTH");
  const result = send(disabled, "CONNECT_PROJECTION", { projection: Projection.CARPLAY });
  assert.equal(result, disabled);
});

test("disabling Bluetooth ends calls and projection", () => {
  let current = send(createInitialState(), "CONNECT_PROJECTION", { projection: Projection.CARPLAY });
  current = send(current, "START_CALL", { target: "Oficina" });
  current = send(current, "TOGGLE_BLUETOOTH");
  assert.equal(current.bluetoothEnabled, false);
  assert.equal(current.phone.connected, false);
  assert.equal(current.phone.activeCall, null);
  assert.equal(current.projection, Projection.NONE);
});

test("disconnect clears projection state", () => {
  const connected = send(createInitialState(), "CONNECT_PROJECTION", { projection: Projection.CARPLAY });
  const disconnected = send(connected, "DISCONNECT_PROJECTION");
  assert.equal(disconnected.projection, Projection.NONE);
  assert.equal(disconnected.projectionConnected, false);
});

test("ignores invalid projection providers", () => {
  const initial = createInitialState();
  assert.equal(send(initial, "CONNECT_PROJECTION", { projection: "unlicensed-clone" }), initial);
});

test("runs media transport controls and wraps the queue", () => {
  let current = send(createInitialState(), "TOGGLE_PLAY");
  assert.equal(current.media.playing, true);
  current = send(current, "PREVIOUS_TRACK");
  assert.equal(current.media.trackIndex, tracks.length - 1);
  current = send(current, "NEXT_TRACK");
  assert.equal(current.media.trackIndex, 0);
  current = send(current, "SELECT_TRACK", { trackIndex: 2 });
  assert.equal(current.media.trackIndex, 2);
  assert.equal(current.media.playing, true);
});

test("clamps seek, volume and brightness ranges", () => {
  let current = send(createInitialState(), "SEEK_MEDIA", { elapsed: 9999 });
  assert.equal(current.media.elapsed, tracks[0].duration);
  current = send(current, "SET_VOLUME", { volume: -50 });
  assert.equal(current.media.volume, 0);
  current = send(current, "SET_BRIGHTNESS", { brightness: 1 });
  assert.equal(current.brightness, 20);
});

test("media clock advances, repeats and proceeds to next track", () => {
  let current = send(createInitialState(), "TOGGLE_PLAY");
  current = send(current, "SEEK_MEDIA", { elapsed: tracks[0].duration - 1 });
  current = send(current, "MEDIA_TICK");
  assert.equal(current.media.trackIndex, 1);
  assert.equal(current.media.elapsed, 0);
  current = send(current, "TOGGLE_REPEAT");
  current = send(current, "SEEK_MEDIA", { elapsed: tracks[1].duration - 1 });
  current = send(current, "MEDIA_TICK");
  assert.equal(current.media.trackIndex, 1);
  assert.equal(current.media.elapsed, 0);
});

test("supports phone connection, keypad and complete call cycle", () => {
  let current = send(createInitialState(), "CONNECT_PHONE");
  current = send(current, "SET_PHONE_VIEW", { view: PhoneView.KEYPAD });
  current = send(current, "DIAL_DIGIT", { digit: "6" });
  current = send(current, "DIAL_DIGIT", { digit: "5" });
  assert.equal(current.phone.dialInput, "65");
  current = send(current, "DIAL_BACKSPACE");
  assert.equal(current.phone.dialInput, "6");
  current = send(current, "START_CALL");
  assert.equal(current.phone.activeCall, "6");
  assert.equal(current.phone.dialInput, "");
  current = send(current, "CALL_TICK");
  assert.equal(current.phone.callSeconds, 1);
  current = send(current, "END_CALL");
  assert.equal(current.phone.activeCall, null);
  assert.equal(current.phone.callSeconds, 0);
});

test("does not start a call without a connected phone", () => {
  const initial = createInitialState();
  assert.equal(send(initial, "START_CALL", { target: "Ana" }), initial);
});

test("restores user settings while keeping the settings tab and clock", () => {
  let current = send(createInitialState(), "SET_VOLUME", { volume: 12 });
  current = send(current, "SET_BRIGHTNESS", { brightness: 25 });
  current = send(current, "TICK", { clock: "16:19", date: "Qua, 22/07" });
  current = send(current, "RESET_SETTINGS");
  assert.equal(current.media.volume, 64);
  assert.equal(current.brightness, 72);
  assert.equal(current.clock, "16:19");
  assert.equal(current.date, "Qua, 22/07");
  assert.equal(current.activeTab, Tab.SETTINGS);
  assert.equal(current.reducedMotion, true);
});
