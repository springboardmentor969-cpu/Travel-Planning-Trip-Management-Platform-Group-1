import { useEffect, useState } from "react";
import groupApi from "../../api/groupApi";
import { useAuth } from "../../context/AuthContext";
import InviteMemberForm from "../../components/groups/InviteMemberForm";
import GroupMemberList from "../../components/groups/GroupMemberList";
import GroupChat from "../../components/groups/GroupChat";
import { formatCurrency } from "../../utils/constants";

export default function GroupCollaboration({ tripId }) {
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [settlement, setSettlement] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [groupData, messageData, settlementData] = await Promise.all([
        groupApi.getGroup(tripId),
        groupApi.getDiscussionMessages(tripId),
        groupApi.getSharedExpenseSettlement(tripId),
      ]);
      setGroup(groupData);
      setMessages(messageData);
      setSettlement(settlementData);
    } catch (err) {
      // leave defaults
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const handleInvite = async (email) => {
    await groupApi.inviteMember(tripId, email);
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the trip?")) return;
    await groupApi.removeMember(tripId, memberId);
    setGroup((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
  };

  const handleRoleChange = async (memberId, role) => {
    await groupApi.updateMemberRole(tripId, memberId, role);
    setGroup((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? { ...m, role } : m
      ),
    }));
  };

  const handleSendMessage = async (message) => {
    const created = await groupApi.postDiscussionMessage(tripId, message);
    setMessages((prev) => [...prev, created]);
  };

  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        Loading group…
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          👥 Group Collaboration
        </h2>
        <p className="text-xs text-slate-500">
          {group?.members?.length || 0} traveler
          {(group?.members?.length || 0) !== 1 ? "s" : ""} on this trip
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Invite a traveler
            </h3>
            <InviteMemberForm onInvite={handleInvite} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Members
            </h3>
            {group?.members?.length ? (
              <GroupMemberList
                members={group.members}
                currentUserId={user?.id}
                onRemove={handleRemoveMember}
                onRoleChange={handleRoleChange}
              />
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-10 text-center">
                <span className="mb-2 text-2xl">🙋</span>
                <p className="text-sm text-slate-400">
                  It's just you so far — invite someone above.
                </p>
              </div>
            )}
          </div>

          {settlement.length > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                💸 Shared expense settlement
              </h3>
              <ul className="space-y-2 text-sm">
                {settlement.map((s, i) => (
                  <li key={i} className="flex justify-between text-slate-600">
                    <span>
                      {s.fromUser} owes {s.toUser}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(s.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            💬 Group discussion
          </h3>
          <GroupChat
            messages={messages}
            currentUserId={user?.id}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}