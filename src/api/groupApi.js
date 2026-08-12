import axiosClient from "./axiosClient";

export const groupApi = {
  getGroup: async (tripId) => {
    const { data } = await axiosClient.get(`/trips/${tripId}/group`);
    return data;
  },

  inviteMember: async (tripId, email) => {
    const { data } = await axiosClient.post(
      `/trips/${tripId}/group/invite`,
      { email }
    );
    return data;
  },

  removeMember: async (tripId, memberId) => {
    await axiosClient.delete(`/trips/${tripId}/group/members/${memberId}`);
  },

  updateMemberRole: async (tripId, memberId, role) => {
    const { data } = await axiosClient.put(
      `/trips/${tripId}/group/members/${memberId}/role`,
      { role }
    );
    return data;
  },

  getDiscussionMessages: async (tripId) => {
    const { data } = await axiosClient.get(
      `/trips/${tripId}/group/discussions`
    );
    return data;
  },

  postDiscussionMessage: async (tripId, message) => {
    const { data } = await axiosClient.post(
      `/trips/${tripId}/group/discussions`,
      { message }
    );
    return data;
  },

  getSharedExpenseSettlement: async (tripId) => {
    const { data } = await axiosClient.get(
      `/trips/${tripId}/group/shared-expenses`
    );
    return data;
  },

  getPendingInvitations: async () => {
    const { data } = await axiosClient.get("/invitations/pending");
    return data;
  },

  acceptInvitation: async (invitationId) => {
    const { data } = await axiosClient.post(`/invitations/${invitationId}/accept`);
    return data;
  },

  rejectInvitation: async (invitationId) => {
    await axiosClient.post(`/invitations/${invitationId}/reject`);
  },
};

export default groupApi;