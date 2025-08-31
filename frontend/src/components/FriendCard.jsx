import { Link } from "react-router-dom";
import { LanguageFlag } from "./LanguageFlag";
import { MoreVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();

  // Mutación para eliminar amigo
  const { mutate: removeFriendMutation, isPending } = useMutation({
    mutationFn: () => removeFriend(friend._id),
    onSuccess: () => {
      // Invalidamos la query de amigos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      console.error("Error removing friend:", error);
    },
  });

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow relative">
      <div className="card-body p-4">
        {/* Top: avatar + name + menu */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="avatar relative size-12">
              <img src={friend.profilePic} alt={friend.fullName} />
              {/* PUNTO ONLINE/OFFLINE (por ahora fijo gris) */}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-200 bg-gray-400"></span>
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
                <button
                  className={`text-error ${isPending ? "opacity-50" : ""}`}
                  disabled={isPending}
                  onClick={() => removeFriendMutation()}
                >
                  {isPending ? "Removing..." : "Remove Friend"}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-nowrap gap-2 mb-3 overflow-x-auto">
          <span className="badge badge-secondary text-xs whitespace-nowrap">
            <LanguageFlag language={friend.nativeLanguage} />
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs whitespace-nowrap">
            <LanguageFlag language={friend.learningLanguage} />
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* Actions */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;