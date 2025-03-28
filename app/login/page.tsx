"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Login } from "../actions";

export default function LoginPage() {
  const login = async () => {
    console.log(await Login("admin@gmail.com", "123456"));
  };

  return (
    <div className=" flex flex-col w-full max-w-2xl text-center items-center justify-center gap-8">
      <Input
        type="text"
        label="Kullanıcı Adı"
        labelPlacement="outside"
        variant="bordered"
        isRequired
        size="lg"
      />
      <Input
        type="password"
        label="Şifre"
        labelPlacement="outside"
        variant="bordered"
        isRequired
        size="lg"
      />
      <Button size="lg" color="primary" className="w-1/2" onPress={login}>
        Giriş Yap
      </Button>
    </div>
  );
}
