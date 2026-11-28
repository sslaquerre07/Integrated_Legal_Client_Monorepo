import "@testing-library/jest-dom";
import { resetNavigationMock } from "$src/test/mocks/next-navigation";

/*** GLOBAL MOCKS ***/

// This ensures any network call fails.
// Tests must supply any data they need themselves (through Mocks).
if (typeof window !== "undefined") {
  global.fetch = (() =>
    Promise.reject(new Error("Unmocked fetch"))) as typeof fetch;
}

jest.mock(
  "next/navigation",
  () => jest.requireActual("$src/test/mocks/next-navigation").navigationMock,
);
beforeEach(resetNavigationMock);
