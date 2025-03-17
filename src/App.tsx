import React, { useState } from "react";
import bg from "./assets/img/bg.svg";
import "./App.css";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
interface GitUsername {
  id: number;
  login: string;
}

interface GitRepo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
}
function App() {
  const [username, setUsername] = useState("");
  const [searchedusername, setSearchedUsername] = useState("");
  const [userData, setUserData] = useState<GitUsername[]>([]);
  const [repos, setRepos] = useState<GitRepo[]>([]);
  const [expand, setExpand] = useState("");
  const [loadingrepos, setLoadingRepos] = useState(false);

  const handleSearch = async () => {
    setSearchedUsername(username);
    try {
      const userResponse = await fetch(
        `https://api.github.com/search/users?q=${username}`
      );
      const user = await userResponse.json();
      setUserData(user.items.slice(0, 5));
    } catch (error) {
      setUserData([]);
    }
  };

  const showRepos = async (username: string) => {
    setExpand(expand === username ? "" : username);
    setLoadingRepos(true);

    try {
      const repoResponse = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repo = await repoResponse.json();
      setRepos(expand === username ? [] : repo);
      setLoadingRepos(false);
    } catch (error) {
      setRepos([]);
    }
  };
  return (
    <div style={{ backgroundImage: `url(${bg})` }}>
      <div className="h-screen w-full flex items-center justify-center">
        <div className="bg-white shadow-lg p-3 rounded-lg w-96">
          <p className="text-sm my-10 font-bold text-center">
            --GitHub repositories explorer--
          </p>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg shadow-md px-5 py-2 "
              placeholder="Enter Username"
            />
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white mt-2 rounded-lg py-2 font-medium"
            >
              Search..
            </button>
          </div>
          <p className="text-xs text-gray-400 mx-2 my-2">
            {searchedusername && userData.length > 0 && (
              <p className="text-xs text-gray-400">
                Showing results for "{searchedusername}"
              </p>
            )}
          </p>

          {userData.length > 0 && (
            <div className="max-h-96 w-full overflow-y-auto border rounded-lg p-3">
              <ul>
                {userData.map((user) => (
                  <li key={user.id}>
                    <p
                      onClick={() => showRepos(user.login)}
                      className="bg-gray-100 my-2 p-2 rounded-lg cursor-pointer flex justify-between"
                    >
                      <span>{user.login}</span>
                      {expand === user.login ? <ChevronUp /> : <ChevronDown />}
                    </p>

                    {expand === user.login && (
                      <div>
                        {loadingrepos ? (
                          <p className="text-center">Loading....</p>
                        ) : repos.length > 0 ? (
                          <div>
                            {repos.map((repo) => (
                              <li
                                className="bg-gray-300 my-2 ml-5 p-2"
                                key={repo.id}
                              >
                                <div className="flex ">
                                  <div className="w-4/5 break-words">
                                    <p className="font-bold text-sm">
                                      {repo.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                      {repo.description === null
                                        ? "no desc"
                                        : repo.description}
                                    </p>
                                  </div>

                                  <div className="w-1/5 flex items-center justify-end gap-1">
                                    <p>{repo.stargazers_count}</p>
                                    <Star />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center">-- repos not found --</p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
