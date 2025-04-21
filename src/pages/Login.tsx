
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, User, Lock } from "lucide-react";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted to-background">
      <Card className="w-[350px] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
            <LogIn size={28} />
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5 mt-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-1 text-sm font-medium">
                <span className="flex items-center gap-1">
                  <User size={16} />
                  Email
                </span>
              </label>
              <Input name="email" placeholder="you@email.com" required autoFocus type="email" />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                <span className="flex items-center gap-1">
                  <Lock size={16} />
                  Password
                </span>
              </label>
              <Input name="password" placeholder="Password" required type="password" minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="text-xs text-muted-foreground mt-4 text-center">
            Belum punya akun? <span className="underline cursor-pointer text-primary">Daftar</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
