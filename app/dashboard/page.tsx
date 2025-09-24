"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthInit } from "@/hooks/use-auth-init";
import { UserAvatar } from "@/components/user-avatar";


export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { isAuthenticated, isLoading } = useAuthInit();

  const handleLogout = async () => {
    try {
      if (user?.id) {
        await fetch("/api/auth/logout", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id })
        });
      }
      
      clearAuth();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuth();
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header con avatar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div>
            <h1 className="text-3xl font-bold">
              Bienvenido, {user.firstName || user.email.split('@')[0]}!
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
        >
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Card de información del usuario */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-4 mb-4">
            <UserAvatar user={user} size="md" />
            <h2 className="text-xl font-semibold">Información del Usuario</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">ID:</label>
              <p className="text-gray-900 font-mono text-xs">{user.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email:</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            {user.firstName && (
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre:</label>
                <p className="text-gray-900">{user.firstName}</p>
              </div>
            )}
            {user.lastName && (
              <div>
                <label className="text-sm font-medium text-gray-500">Apellido:</label>
                <p className="text-gray-900">{user.lastName}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Card de estado */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Estado de Sesión</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserAvatar user={user} size="sm" />
              <p className="text-green-700">✅ Autenticado correctamente</p>
            </div>
            <p className="text-sm text-green-600">
              Última conexión: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats o información adicional */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Panel de Control</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border text-center">
            <p className="text-2xl font-bold text-blue-600">1</p>
            <p className="text-sm text-gray-600">Sesiones Activas</p>
          </div>
          <div className="bg-white p-4 rounded border text-center">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Notificaciones</p>
          </div>
          <div className="bg-white p-4 rounded border text-center">
            <p className="text-2xl font-bold text-purple-600">Premium</p>
            <p className="text-sm text-gray-600">Plan Actual</p>
          </div>
        </div>
      </div>
    </div>
  );
}