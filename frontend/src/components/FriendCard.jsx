import { Link } from "react-router-dom";
import { LanguageFlag } from "./LanguageFlag";
import { MoreVertical } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow relative">
      <div className="card-body p-4">

        {/* Top: avatar + name + menu */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="avatar relative size-12">
              <img src={friend.profilePic} alt={friend.fullName} />
            </div>
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
          </div>

          {/* Dropdown menu */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-xs m-1">
              <MoreVertical className="w-4 h-4" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40"
            >
              <li>
                <Link to={`/profile/${friend._id}`}>View Profile</Link>
              </li>
              <li>
                <button className="text-error">Remove Friend</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            <LanguageFlag language={friend.nativeLanguage} />
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            <LanguageFlag language={friend.learningLanguage} />
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* Actions */}
        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline w-full"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;