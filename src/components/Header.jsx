function Header() {
  return (
    <header className="flex items-center justify-center gap-0 p-1">
      {/* Logo */}
      <img
        src="logo.png"
        alt="Cinezy Logo"
        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
      />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-black-400 tracking-wide">
        Cinezy
      </h1>
    </header>
  );
}

export default Header;
