import UserMenu from "./UserMenu";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center px-4 h-24">
      <h2 className="text-4xl font-medium">Tecsa Group</h2>
      <UserMenu />
    </div>
  );
};

export default Header;
