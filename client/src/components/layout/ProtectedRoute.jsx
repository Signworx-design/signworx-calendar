import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

export default function ProtectedRoute({ children }) {
  const { checking, isUnlocked } = useAuth();
  if (checking) return <Loader label="Checking secure session" />;
  if (!isUnlocked) return <Navigate to="/password" replace />;
  return children;
}
