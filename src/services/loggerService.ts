import { connectMongo } from "../lib/mongoConnection";
import { Logger, loggerModel } from "../modals";

export const addSingleLog = async (payload: Partial<Logger>) => {
  try {
    await connectMongo();
    const result = await loggerModel.create(payload);
    if (!result?.id) {
      throw new Error("Failed to add log");
    }
    return { error: "", result };
  } catch (e) {
    console.error(e);
    return { error: e, result: "" };
  }
};

type FilterT = {
  filterValue: string;
  filterBy: "ALL" | string[];
  dateFilter: string[];
};
type getAllLogsServicepayloadT = {
  limit?: number;
  offset?: number;
  filters?: Partial<FilterT>;
};
export const getAllLogsService = async (
  payload?: getAllLogsServicepayloadT
) => {
  try {
    const { filters } = payload || {};
    await connectMongo();
    let query: Record<string, any> = {};

    if (filters?.filterBy === "ALL" && filters?.filterValue) {
      // Check if any field in loggerSchema of type String contains the filter value
      query = {
        $or: [
          {
            level: { $regex: filters?.filterValue, $options: 'i' }},{
            message: { $regex: filters?.filterValue, $options: 'i' }},{
            resourceId: { $regex: filters?.filterValue, $options: 'i' }},{
            traceId: { $regex: filters?.filterValue, $options: 'i' }},{
            spanId: { $regex: filters?.filterValue, $options: 'i' }},{
            commit: { $regex: filters?.filterValue, $options: 'i' }},{
            metadata: {
              parentResourceId: { $regex: filters?.filterValue, $options: 'i' },
            }},
          
        ],
      };
    } else if (filters?.filterBy && filters?.filterValue) {
      // Iterate over specified filterBy keys
      for (const key of filters.filterBy) {
        if (key === "parentResourceId") {
          query["metadata.parentResourceId"] = {
            $regex: filters?.filterValue,
            $options: "i",
          };
        } else {
          query[key] = { $regex: filters.filterValue, $options: "i" };
        }
      }
    }

    
    if (filters?.dateFilter && filters?.dateFilter.length === 2) {
      const [startDate, endDate] = filters?.dateFilter;
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const result = await loggerModel
      .find(query)
      .limit(payload?.limit || 10)
      .skip(payload?.offset || 0)
      

    const totalCount = await loggerModel
      .find(query)
      .countDocuments();
    return {
      error: "",
      result,
      totalCount,
    };
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to get logs",
      result: [],
    };
  }
};
