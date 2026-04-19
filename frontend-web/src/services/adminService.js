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

const fetchTaxonomyTree = async (payload) => {
    const res = await api.get(`${endpointTaxonomy}/taxonomy-tree`, { params: payload });
    return res.data.data;
}

const createAccount = async (payload) => {
    const res = await api.post('/admin/accounts', payload);
    return res.data;
}

const updateAccount = async (id, payload) => {
    const res = await api.put(`/admin/accounts/${id}`, payload);
    return res.data;
}

const updatePassword = async (id, payload) => {
    const res = await api.put(`/admin/accounts/${id}/password`, payload);
    return res.data;
}

const toggleStatus = async (id, payload) => {
    const res = await api.put(`/admin/accounts/${id}/status`, payload);
    return res.data;
}

const deleteAccount = async (id) => {
    const res = await api.delete(`/admin/accounts/${id}`);
    return res.data;
}


const updateMyProfile = async (payload) => {
    const res = await api.put('/auth/profile', payload);
    return res.data;
}

const changeMyPassword = async (payload) => {
    const res = await api.put('/auth/change-password', payload);
    return res.data;
}

const logout = async () => {
    const res = await api.post('/auth/logout');
    return res.data;
}

const login = async (payload) => {
    const res = await api.post('/auth/login', payload);
    return res.data;
}

const getMyProfile = async () => {
    const res = await api.get('/auth/me');
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
    fetchProvinces,
    fetchTaxonomyTree,
    createAccount,
    updateAccount,
    updatePassword,
    toggleStatus,
    deleteAccount,
    updateMyProfile,
    changeMyPassword,
    logout,
    login,
    getMyProfile
};

