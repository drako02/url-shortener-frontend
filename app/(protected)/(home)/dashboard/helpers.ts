import { fetchRequest, APIResponse } from "@/app/api/helpers";
import { ClicksResponse } from "@/app/api/types";
import { getShortUrls } from "@/app/api/urls/urls";
import { useAuth } from "@/context/Auth";
import { auth } from "@/firebaseConfig";
import { format } from "date-fns";
import { useReducer, useCallback, useEffect } from "react";
import { toast } from "sonner";

export const last7Days = () => {
  const today = new Date().getDay();
  console.log({ today });
  const last7DaysInd: number[] = [];
  for (let i = 0; i < 7; i++) {
    last7DaysInd.unshift((today - i + 7) % 7);
  }
  console.log(last7DaysInd);
  return last7DaysInd;
};

export const getClicksFromLast7Days = async (userId: number) => {
  const today = new Date().toISOString();
  const sevenDaysAgo = new Date(
    Date.now() - 6 * 60 * 60 * 24 * 1000
  ).toISOString();
  console.log({ today, sevenDaysAgo });
  const res = await fetchRequest<APIResponse<ClicksResponse[]>>(
    `/api/dashboard/getClicks?userId=${userId}&start=${sevenDaysAgo}&end=${today}`,
    {}
  );

  return res.data || [];
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const getChartData = (clicks: ClicksResponse[]) => {
  const clicksByWeekday: Record<string, number> = {};
  last7Days().forEach((dayIndex) => {
    clicksByWeekday[WEEKDAYS[dayIndex]] = 0;
  });

  clicks.forEach((click) => {
    const clickDay = new Date(click.timestamp).getDay();
    const weekdayName = WEEKDAYS[clickDay];
    clicksByWeekday[weekdayName] += 1;
  });

  return Object.entries(clicksByWeekday).map(([name, clicks]) => ({
    name,
    clicks,
  }));
};

type ShortcodeAndClicks = {
  shortcode: string;
  clicks: number;
};

export const useDashboardData = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const { user } = useAuth();

  const getTotalURLs = useCallback(async () => {
    if (!user) return;
    try {
      dispatch({ type: "GET_TOTAL_URLS_START" });
      const result = await getShortUrls(user?.uid, 0, 0);
      dispatch({ type: "GET_TOTAL_URLS_SUCCESS", payload: result.recordCount });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch URLs total";
      dispatch({ type: "GET_TOTAL_URLS_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user]);

  const getTopClicked = useCallback(async () => {
    try {
      dispatch({ type: "GET_TOP_CLICKED_START" });
      const res = await fetchRequest<
        APIResponse<{ shortCode: string; totalClicks: number }[]>
      >(`/api/dashboard/topclicked?userId=${user?.id}&limit=5`, {});
      const payload =
        res.data?.map((i) => ({
          shortcode: i.shortCode,
          clicks: i.totalClicks,
        })) || [];
      dispatch({ type: "GET_TOP_CLICKED_SUCCESS", payload });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch top clicked URLs";
      dispatch({ type: "GET_TOP_CLICKED_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user?.id]);

  const getTotalActiveUrls = useCallback(async () => {
    try {
      dispatch({ type: "GET_TOTAL_ACTIVE_URLS_START" });
      const idToken = await auth.currentUser?.getIdToken();
      const res = (await fetchRequest(
        `/api/dashboard/active?uid=${user?.uid}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      )) as APIResponse<{ length: number }>;
      if (!res.success || !res.data) {
        toast.error("Could not get active URLs");
        console.error(res.errors);
        return;
      }
      console.log("Active Urls length: ", res.data.length);
      dispatch({
        type: "GET_TOTAL_ACTIVE_URLS_SUCCESS",
        payload: res.data.length,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch total active URLs";
      dispatch({ type: "GET_TOTAL_ACTIVE_URLS_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user?.uid]);

  const getTotalClicks = useCallback(async () => {
    try {
      dispatch({ type: "GET_TOTAL_CLICKS_START" });
      const res = await fetchRequest<APIResponse<{ totalClicks: number }>>(
        `/api/dashboard/clicks?userId=${user?.id}`,
        {}
      );
      if (res.success && res.data) {
        dispatch({
          type: "GET_TOTAL_CLICKS_SUCCESS",
          payload: res.data.totalClicks,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch total clicks";
      dispatch({ type: "GET_TOTAL_CLICKS_ERROR", payload: errorMessage });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user?.id]);

  const getLast7DaysAnalytics = useCallback(async () => {
    try {
      dispatch({ type: "GET_LAST_7_DAYS_ANALYTICS_START" });
      const last7DaysClicks = await getClicksFromLast7Days(user?.id);
      const chartData = getChartData(last7DaysClicks);
      dispatch({
        type: "GET_LAST_7_DAYS_ANALYTICS_SUCCESS",
        payload: chartData,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch analytics";
      dispatch({
        type: "GET_LAST_7_DAYS_ANALYTICS_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage);
      console.error(error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const getAnalytics = async () => {
      await Promise.all([
        getTotalURLs(),
        getTotalActiveUrls(),
        getTopClicked(),
        getTotalClicks(),
        getLast7DaysAnalytics(),
      ]);
    };
    getAnalytics();
  }, [
    getLast7DaysAnalytics,
    getTopClicked,
    getTotalActiveUrls,
    getTotalClicks,
    getTotalURLs,
    user?.id,
  ]);

  return {
    getTopClicked,
    getTotalURLs,
    getTotalActiveUrls,
    getLast7DaysAnalytics,
    totalActiveLinks: state.totalActiveUrls.data,
    totalClicks: state.totalClicks.data,
    totalUrls: state.totalUrls.data,
    topClicked: state.topClicked.data,
    last7DaysAnalytics: state.last7DaysAnalytics.data,
    loading: {
      totalUrls: state.totalUrls.loading,
      totalActiveUrls: state.totalActiveUrls.loading,
      topClicked: state.topClicked.loading,
      totalClicks: state.totalClicks.loading,
      last7DaysAnalytics: state.last7DaysAnalytics.loading,
    },
    errors: {
      totalUrls: state.totalUrls.error,
      totalActiveUrls: state.totalActiveUrls.error,
      topClicked: state.topClicked.error,
      totalClicks: state.totalClicks.error,
      last7DaysAnalytics: state.last7DaysAnalytics.error,
    },
  };
};

// const actions = {
//   GET_TOTAL_URLS: "GET_TOTAL_URLS",
//   GET_TOTAL_ACTIVE_URLS: "GET_TOTAL_ACTIVE_URLS",
//   GET_TOP_CLICKED: "GET_TOP_CLICKED",
// } as const;

type DashboardAction =
  | { type: "GET_TOTAL_URLS_START" }
  | { type: "GET_TOTAL_URLS_SUCCESS"; payload: number }
  | { type: "GET_TOTAL_URLS_ERROR"; payload: string }
  | { type: "GET_TOTAL_ACTIVE_URLS_START" }
  | { type: "GET_TOTAL_ACTIVE_URLS_SUCCESS"; payload: number }
  | { type: "GET_TOTAL_ACTIVE_URLS_ERROR"; payload: string }
  | { type: "GET_TOP_CLICKED_START" }
  | { type: "GET_TOP_CLICKED_SUCCESS"; payload: ShortcodeAndClicks[] }
  | { type: "GET_TOP_CLICKED_ERROR"; payload: string }
  | { type: "GET_TOTAL_CLICKS_START" }
  | { type: "GET_TOTAL_CLICKS_SUCCESS"; payload: number }
  | { type: "GET_TOTAL_CLICKS_ERROR"; payload: string }
  | { type: "GET_LAST_7_DAYS_ANALYTICS_START" }
  | {
      type: "GET_LAST_7_DAYS_ANALYTICS_SUCCESS";
      payload: { name: string; clicks: number }[];
    }
  | { type: "GET_LAST_7_DAYS_ANALYTICS_ERROR"; payload: string };

type DashboardState = {
  totalUrls: {
    data: number | null;
    loading: boolean;
    error: string | null;
  };
  totalActiveUrls: {
    data: number | null;
    loading: boolean;
    error: string | null;
  };
  topClicked: {
    data: ShortcodeAndClicks[] | null;
    loading: boolean;
    error: string | null;
  };
  totalClicks: {
    data: number | null;
    loading: boolean;
    error: string | null;
  };
  last7DaysAnalytics: {
    data: { name: string; clicks: number }[] | null;
    loading: boolean;
    error: string | null;
  };
};

const initialDashboardState: DashboardState = {
  totalUrls: { data: null, loading: false, error: null },
  totalActiveUrls: { data: null, loading: false, error: null },
  topClicked: { data: null, loading: false, error: null },
  totalClicks: { data: null, loading: false, error: null },
  last7DaysAnalytics: { data: null, loading: false, error: null },
};

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case "GET_TOTAL_URLS_START":
      return {
        ...state,
        totalUrls: { ...state.totalUrls, loading: true, error: null },
      };
    case "GET_TOTAL_URLS_SUCCESS":
      return {
        ...state,
        totalUrls: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOTAL_URLS_ERROR":
      return {
        ...state,
        totalUrls: {
          ...state.totalUrls,
          loading: false,
          error: action.payload,
        },
      };
    case "GET_TOTAL_ACTIVE_URLS_START":
      return {
        ...state,
        totalActiveUrls: {
          ...state.totalActiveUrls,
          loading: true,
          error: null,
        },
      };
    case "GET_TOTAL_ACTIVE_URLS_SUCCESS":
      return {
        ...state,
        totalActiveUrls: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOTAL_ACTIVE_URLS_ERROR":
      return {
        ...state,
        totalActiveUrls: {
          ...state.totalActiveUrls,
          loading: false,
          error: action.payload,
        },
      };
    case "GET_TOP_CLICKED_START":
      return {
        ...state,
        topClicked: { ...state.topClicked, loading: true, error: null },
      };
    case "GET_TOP_CLICKED_SUCCESS":
      return {
        ...state,
        topClicked: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOP_CLICKED_ERROR":
      return {
        ...state,
        topClicked: {
          ...state.topClicked,
          loading: false,
          error: action.payload,
        },
      };
    case "GET_TOTAL_CLICKS_START":
      return {
        ...state,
        totalClicks: {
          ...state.totalClicks,
          loading: true,
          error: null,
        },
      };
    case "GET_TOTAL_CLICKS_SUCCESS":
      return {
        ...state,
        totalClicks: { data: action.payload, loading: false, error: null },
      };
    case "GET_TOTAL_CLICKS_ERROR":
      return {
        ...state,
        totalClicks: {
          ...state.totalClicks,
          loading: false,
          error: action.payload,
        },
      };
    case "GET_LAST_7_DAYS_ANALYTICS_START":
      return {
        ...state,
        last7DaysAnalytics: {
          ...state.last7DaysAnalytics,
          loading: true,
          error: null,
        },
      };
    case "GET_LAST_7_DAYS_ANALYTICS_SUCCESS":
      return {
        ...state,
        last7DaysAnalytics: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case "GET_LAST_7_DAYS_ANALYTICS_ERROR":
      return {
        ...state,
        last7DaysAnalytics: {
          ...state.last7DaysAnalytics,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};
