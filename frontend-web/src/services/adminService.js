import api from "./api";

// Dashboard Page

const fetchDashboardStats = async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
};

const endpointFetchFamily='/taxonomy/families';
const endpointFetchGenus='/taxonomy/genera';

const endpointTaxonomy='/taxonomy';

const fetchAllItems = async (type) => {
    const res =  await api.get(`${endpointTaxonomy}/${type}/all`);
    return res.data;
};

const updateGenus = async (genusId, payload) => {
    const res = await api.put(`${endpointTaxonomy}/genera/${genusId}`, payload);
    return res.data;
}
const createGenus = async (payload) => {
    const res = await api.post(`${endpointTaxonomy}/genera`, payload);
    return res.data;
}
export default {
    fetchDashboardStats,
    endpointFetchFamily,
    endpointTaxonomy,
    endpointFetchGenus,
    fetchAllItems,
    updateGenus,
    createGenus
};

