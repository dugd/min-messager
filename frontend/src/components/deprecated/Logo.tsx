import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <img
        src={logoImage}
        alt="Min Messager"
        className="h-8 w-8"
      />
      <span className="text-xl font-semibold text-white hidden sm:block">
        Min Messager
      </span>
    </Link>
  );
}
