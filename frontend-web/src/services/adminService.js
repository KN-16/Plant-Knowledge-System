import api from "./api";

// Dashboard Page

const fetchDashboardStats = async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
};

const endpointFetchFamily='/taxonomy/families';
const endpointFetchGenus='/taxonomy/genera';
const endpointFetchSpecies='/taxonomy/species';
const endpointFetchVarieties = '/taxonomy/varieties';

const endpointTaxonomy='/taxonomy';

const fetchAllItems = async (type) => {
    const res =  await api.get(`${endpointTaxonomy}/${type}/all`);
    return res.data;
};

// Genus
const updateGenus = async (genusId, payload) => {
    const res = await api.put(`${endpointTaxonomy}/genera/${genusId}`, payload);
    return res.data;
}
const createGenus = async (payload) => {
    const res = await api.post(`${endpointTaxonomy}/genera`, payload);
    return res.data;
}

// Species
const createSpecies = async (payload) => {
    const res = await api.post(`${endpointTaxonomy}/species`, payload);
    return res.data;
}
const updateSpecies = async (speciesId, payload) => {
    const res = await api.put(`${endpointTaxonomy}/species/${speciesId}`, payload);
    return res.data;
}

// Varieties
const getVarietyDetail = async (id) => {
        const res = await api.get(`${endpointTaxonomy}/varieties/${id}`);
        return res.data;
    };

const saveVariety = async (id, formDataPayload) => {
        // Gửi FormData (chứa file)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (id) {
            return await api.put(`${endpointTaxonomy}/varieties/${id}`, formDataPayload, config);
        }
        return await api.post(`${endpointTaxonomy}/varieties`, formDataPayload, config);
    }

const fetchUIOptions = async () => {
    const res = await api.get(`${endpointTaxonomy}/varieties/ui-options`);
    return res.data;
}

const fetchProvinces = async () => {
    const res = await api.get(`${endpointTaxonomy}/varieties/provinces`);
    return res.data;
}
export default {
    fetchDashboardStats,
    endpointFetchFamily,
    endpointTaxonomy,
    endpointFetchGenus,
    endpointFetchSpecies,
    endpointFetchVarieties,
    fetchAllItems,
    updateGenus,
    createGenus,
    createSpecies,
    updateSpecies,
    getVarietyDetail,
    saveVariety,
    fetchUIOptions,
    fetchProvinces
};

