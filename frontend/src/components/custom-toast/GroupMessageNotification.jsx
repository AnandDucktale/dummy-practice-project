import defaultAvatar from '../../assets/defaultAvatar1.jpg';

const GroupMessageNotification = ({ senderInfo, group }) => {
  return (
    <div className="relative flex gap-4 bg-slate-800 px-6 py-3 rounded-xl shadow-xl overflow-visible">
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-slate-700 ring-4 ring-slate-800 z-50">
        <img
          src={senderInfo.avatar || defaultAvatar}
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      <div className="pl-10">
        <p className="text-white font-semibold">
          {senderInfo.firstName} {senderInfo.lastName}
        </p>
        <p className="text-sm text-zinc-400">
          {senderInfo.firstName} sent something in group "{group.name}"
        </p>
      </div>
    </div>
  );
};

export default GroupMessageNotification;
