"use client";

import LeaveIcon from "@/components/atoms/icons/Leave";
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { useState } from "react";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="user-menu">
      <button
        className="user-menu--avatar"
        onClick={() => setIsMenuOpen((s) => !s)}
      >
        <img
          className="rounded-full w-12 h-12"
          src={user?.avatar_url ?? ""}
          alt="Imagem do Usuário"
          // width={48}
          // height={48}
        />
        <span>{user?.name}</span>
      </button>
      {isMenuOpen && (
        <ul className="user-menu--container">
          <li>
            <button className="btn btn-error btn-sm" onClick={signOut}>
              <LeaveIcon />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
