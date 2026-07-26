import { GROUP_MEMBER_ROLES } from "../../utils/constants";

export default function GroupMemberList({
  members,
  currentUserId,
  onRemove,
  onRoleChange,
}) {
  return (
    <div className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
              {member.name?.charAt(0)?.toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {member.name}
                {member.userId === currentUserId && (
                  <span className="ml-1 text-xs text-slate-400">(you)</span>
                )}
              </p>
              <p className="text-xs text-slate-500">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={member.role}
              onChange={(e) => onRoleChange(member.id, e.target.value)}
              disabled={member.role === GROUP_MEMBER_ROLES.OWNER}
              className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-slate-50"
            >
              {Object.values(GROUP_MEMBER_ROLES).map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>
            {member.role !== GROUP_MEMBER_ROLES.OWNER && (
              <button
                onClick={() => onRemove(member.id)}
                className="text-xs font-medium text-slate-400 hover:text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}