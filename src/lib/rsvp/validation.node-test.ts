import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateRsvpInput } from "./validation.ts";
import { formatPartyBreakdown, resolveSeatBreakdown } from "./seats.ts";

describe("validateRsvpInput", () => {
  it("acepta solo adultos dentro del cupo", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 4,
      adultCount: 3,
      childCount: 0,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.confirmedSeats, 3);
      assert.equal(result.adultCount, 3);
      assert.equal(result.childCount, 0);
    }
  });

  it("acepta adultos + niños dentro del cupo", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 4,
      adultCount: 2,
      childCount: 2,
    });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.confirmedSeats, 4);
  });

  it("rechaza sobrecupo", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 4,
      adultCount: 4,
      childCount: 2,
    });
    assert.equal(result.ok, false);
  });

  it("rechaza adultos negativos", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 4,
      adultCount: -1,
      childCount: 1,
    });
    assert.equal(result.ok, false);
  });

  it("rechaza niños negativos", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 4,
      adultCount: 1,
      childCount: -1,
    });
    assert.equal(result.ok, false);
  });

  it("rechaza no enteros", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 4,
      adultCount: 1.5,
      childCount: 1,
    });
    assert.equal(result.ok, false);
  });

  it("decline fuerza 0/0/0", () => {
    const result = validateRsvpInput({
      attending: false,
      maxSeats: 4,
      adultCount: 2,
      childCount: 1,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.confirmedSeats, 0);
      assert.equal(result.adultCount, 0);
      assert.equal(result.childCount, 0);
    }
  });

  it("compatibilidad legacy: confirmedSeats como adultos", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 3,
      confirmedSeats: 2,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.adultCount, 2);
      assert.equal(result.childCount, 0);
      assert.equal(result.confirmedSeats, 2);
    }
  });

  it("permite 0 adultos + N niños si hay cupo", () => {
    const result = validateRsvpInput({
      attending: true,
      maxSeats: 3,
      adultCount: 0,
      childCount: 2,
    });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.confirmedSeats, 2);
  });
});

describe("resolveSeatBreakdown", () => {
  it("legacy attending sin counts → todos adultos", () => {
    const result = resolveSeatBreakdown({
      attending: true,
      confirmedSeats: 3,
      adultCount: null,
      childCount: null,
    });
    assert.deepEqual(result, {
      adultCount: 3,
      childCount: 0,
      confirmedSeats: 3,
    });
  });

  it("declined → ceros", () => {
    const result = resolveSeatBreakdown({
      attending: false,
      confirmedSeats: 0,
      adultCount: 2,
      childCount: 1,
    });
    assert.deepEqual(result, {
      adultCount: 0,
      childCount: 0,
      confirmedSeats: 0,
    });
  });
});

describe("formatPartyBreakdown", () => {
  it("formatea adultos y niños", () => {
    assert.equal(formatPartyBreakdown(2, 1), "2 adultos · 1 niño");
    assert.equal(formatPartyBreakdown(1, 0), "1 adulto");
  });
});
