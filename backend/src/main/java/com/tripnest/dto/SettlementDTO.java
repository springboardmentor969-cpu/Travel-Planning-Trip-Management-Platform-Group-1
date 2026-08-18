package com.tripnest.dto;

import java.util.List;
import java.util.Map;

public class SettlementDTO {
    public static class MemberSpending {
        private Long userId;
        private String userName;
        private Double totalPaid;
        private Double fairShare;
        private Double netBalance; // positive means owed money, negative means owes money

        public MemberSpending() {}
        public MemberSpending(Long userId, String userName, Double totalPaid, Double fairShare, Double netBalance) {
            this.userId = userId;
            this.userName = userName;
            this.totalPaid = totalPaid;
            this.fairShare = fairShare;
            this.netBalance = netBalance;
        }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public Double getTotalPaid() { return totalPaid; }
        public void setTotalPaid(Double totalPaid) { this.totalPaid = totalPaid; }
        public Double getFairShare() { return fairShare; }
        public void setFairShare(Double fairShare) { this.fairShare = fairShare; }
        public Double getNetBalance() { return netBalance; }
        public void setNetBalance(Double netBalance) { this.netBalance = netBalance; }
    }

    public static class TransferProposal {
        private String fromUser;
        private String toUser;
        private Double amount;

        public TransferProposal() {}
        public TransferProposal(String fromUser, String toUser, Double amount) {
            this.fromUser = fromUser;
            this.toUser = toUser;
            this.amount = amount;
        }

        public String getFromUser() { return fromUser; }
        public void setFromUser(String fromUser) { this.fromUser = fromUser; }
        public String getToUser() { return toUser; }
        public void setToUser(String toUser) { this.toUser = toUser; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
    }

    private Long tripId;
    private Double totalExpenses;
    private Integer totalMembers;
    private Double equalSharePerMember;
    private List<MemberSpending> memberBalances;
    private List<TransferProposal> settlements;

    public SettlementDTO() {}

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public Double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(Double totalExpenses) { this.totalExpenses = totalExpenses; }
    public Integer getTotalMembers() { return totalMembers; }
    public void setTotalMembers(Integer totalMembers) { this.totalMembers = totalMembers; }
    public Double getEqualSharePerMember() { return equalSharePerMember; }
    public void setEqualSharePerMember(Double equalSharePerMember) { this.equalSharePerMember = equalSharePerMember; }
    public List<MemberSpending> getMemberBalances() { return memberBalances; }
    public void setMemberBalances(List<MemberSpending> memberBalances) { this.memberBalances = memberBalances; }
    public List<TransferProposal> getSettlements() { return settlements; }
    public void setSettlements(List<TransferProposal> settlements) { this.settlements = settlements; }
}
