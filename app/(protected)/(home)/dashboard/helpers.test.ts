jest.mock("@/firebaseConfig", () => ({
  auth: jest.fn().mockReturnValue({})
}));

jest.mock("@/context/Auth", () => ({
    useAuth: jest.fn().mockReturnValue({
      user: { uid: "test-uid", id: "test-id" },
    }),
  }));

  jest.mock("@/app/api/helpers", () => ({
    fetchRequest: jest.fn()
  }));

import { fetchRequest } from "@/app/api/helpers";
// import { fetchRequest } from "@/app/api/helpers";
import { last7Days, getClicksFromLast7Days } from "./helpers";

// jest.mock("./helpers", () => {
//     return {
//         last7Days: jest.requireActual("./helpers").last7Days,
//         getChartData: jest.fn(),
//         useDashboardData: jest.fn()
//     }
// })

test("last7Days", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-06-14"));

  const res = last7Days();
  expect(res).toEqual([0, 1, 2, 3, 4, 5, 6]);

  jest.clearAllTimers()
  jest.setSystemTime(new Date("2025-06-18"));
//   const res2 = last7Days();
  expect(last7Days()).toEqual([4,5,6,0,1,2,3]);

});

test("getClicksFromLast7Days", () => {
  jest.clearAllTimers()

  const mockResponse = {
    success: true,
    data: []
  };
  
  (fetchRequest as jest.Mock).mockResolvedValue(mockResponse);
  getClicksFromLast7Days(5)
  expect(fetchRequest).toHaveBeenCalledTimes(1)
})
