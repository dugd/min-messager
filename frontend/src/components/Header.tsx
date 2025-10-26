import AuthActions from './AuthActions';
import Logo from './Logo';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#1c1c1e] border-b border-[#2c2c2e] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation - centered on larger screens */}
          <div className="flex-1 flex justify-center mx-4">
            <Navigation />
          </div>

          {/* Auth Actions */}
          <AuthActions />
        </div>
      </div>
    </header>
  );
}
