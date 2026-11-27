export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

export const navigationMock = {
  ...jest.requireActual("next/navigation"),
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
};

export function resetNavigationMock() {
  Object.values(mockRouter).forEach((fn) => fn.mockReset());
}