import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="flex items-center justify-center w-40 h-40 bg-slate-50 mb-12">
      
      </div>
      <form className="flex flex-col gap-4 w-full md:w-1/3">
        <h3 className="font-semibold">Esqueci a senha</h3>
        <Input 
          placeholder="Informe o e-mail"
        />
        <Button>Recuperar</Button>
      </form>
      <Link to="/signin" className="hover:cursor-pointer hover:underline my-2">Voltar</Link>
    </div>
  )
}