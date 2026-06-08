import { usePrivy } from "@privy-io/react-auth";
import useNavbar from "../hooks/useNavbar";
import { RiMenu3Line } from "react-icons/ri";
import { useEffect } from "react";

const index = () => {
  const setIsOpen = useNavbar((state) => state.setIsOpen);
  const { logout, login, authenticated } = usePrivy();

  useEffect(() => { }, [authenticated]);

  return (
    <div className="text-white flex justify-between w-full px-5 py-4 items-center font-['Geist'] md:px-14 px-4">
      <div className="text-white flex justify-between w-max px-4 items-center">
        <img
          className="mr-2"
          src="https://canada1.discourse-cdn.com/flex011/uploads/metamaskbuilderhub/optimized/1X/082cfc3a14103b01cfa5ef7d85f1121a23fa3e81_2_32x32.png"
          alt="logo"
        />
        <h3 className="font-bold uppercase">MetaMux</h3>
      </div>
      <div className="text-white flex justify-between w-max px-4 items-center md:flex hidden">
        <p className="cursor-pointer" onClick={() => setIsOpen("agents")}>
          Agents
        </p>
        <p
          className="mx-4 cursor-pointer"
          onClick={() => setIsOpen("capabilites")}
        >
          Capabilites
        </p>
        <p className="cursor-pointer" onClick={() => setIsOpen("audience")}>
          Audience
        </p>
      </div>
      <div className="w-max">
        <button
          onClick={() => (authenticated ? logout() : login())}
          className="hidden md:flex px-4 py-2 border-l-2 border-l-white  border-r-2 border-r-white  uppercase cursor-pointer"
        >
          {authenticated ? "Disconnect" : "Try Metamux"}
        </button>
        <button className="md:hidden">
          <RiMenu3Line size={24} onClick={() => setIsOpen("menu")} />
        </button>
      </div>
    </div>
  );
};

export default index;
