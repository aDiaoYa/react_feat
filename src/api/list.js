import service from "./request";

export const getList = (params) => service.get(`/news?num=${params}`);
