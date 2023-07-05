"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface ILog {
  createdAt: string;
  type: "login" | "logout" | "não definido";
  user: {
    avatar_url: string;
    created_at: string;
    name: string;
  };
}

const UserLogs = () => {
  const [logs, setLogs] = useState<ILog[]>([]);

  useEffect(() => {
    axios("/api/logs").then((res) => {
      setLogs(res?.data ?? []);
    });
  }, []);

  return (
    <section className="bg-slate-800/50 rounded-t-lg shadow-xl p-4 h-full w-full overflow-y-auto flex flex-col gap-4">
      <h2 className="text-2xl font-medium">Logs de Usuário:</h2>
      <ul className="p-6 flex flex-col gap-4">
        {logs.map((log) => {
          return (
            <li
              className="bg-slate-900 hover:bg-slate-900/80 hover:ring-1 shadow-sm p-2 w-full rounded-lg flex items-center gap-4"
              key={log.createdAt}
            >
              <img
                src={log?.user?.avatar_url ?? ""}
                alt="Foto do usuário"
                className="h-12 w-12 rounded-full"
              />
              <span>{log?.user?.name}</span>
              <span className="capitalize text-zinc-300">{log?.type}</span>
              <span className="ml-auto">
                {new Date(log.createdAt).toLocaleString("pt-BR", {})}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default UserLogs;
